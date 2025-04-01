package com.fis.backend.services.impl;

import com.fis.backend.dto.identity.*;
import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.request.UserChangePassword;
import com.fis.backend.dto.request.UserUpdateRequest;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.entity.User;
import com.fis.backend.entity.UserDetail;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.exception.ErrorNormalizer;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.integration.KeycloakRepository;
import com.fis.backend.repository.UserDetailRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.GoogleDriveService;
import com.fis.backend.services.MailService;
import com.fis.backend.services.OtpService;
import com.fis.backend.services.UserService;
import com.fis.backend.utils.AuthenUtil;
import com.fis.backend.utils.enums.FolderType;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserDetailRepository userDetailRepository;
    UserMapper userMapper;
    GoogleDriveService googleDriveService;
    KeycloakRepository keycloakRepository;
    ErrorNormalizer errorNormalizer;
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
    private final MailService mailService;
    private final OtpService otpService;

    @Value("${keycloak.client-id}")
    @NonFinal
    String clientId;

    @Value("${keycloak.client-secret}")
    @NonFinal
    String clientSecret;

    @Override
    public AuthenticationResponse refreshToken(String refreshToken) {
        try {
            var token = keycloakRepository.refreshToken(
                    "Basic " + AuthenUtil.encodeBasicAuth(clientId, clientSecret),
                    RefreshTokenParam.builder()
                            .grant_type("refresh_token")
                            .refresh_token(refreshToken)
                            .build());
            return AuthenticationResponse.builder()
                    .accessToken(token.getAccessToken())
                    .expiresIn(token.getExpiresIn())
                    .refreshExpiresIn(token.getRefreshExpiresIn())
                    .refreshToken(token.getRefreshToken())
                    .tokenType(token.getTokenType())
                    .idToken(token.getIdToken())
                    .scope(token.getScope())
                    .build();
        } catch (FeignException e) {
            log.error("Error refreshing token: {}", e.getMessage());
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
    }

    @Override
    @Transactional
    public UserResponse register(RegistrationRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException(ErrorCode.USERNAME_EXISTED);
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        if (request.getPassword() == null) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        User user = userMapper.toUser(request);

        String encodePassword = bCryptPasswordEncoder.encode(request.getPassword());
        user.setPassword(encodePassword);

        userRepository.save(user);

        userRepository.save(user);

        UserDetail userDetail = new UserDetail();
        userDetail.setUid(user.getId());
        userDetailRepository.save(userDetail);

        user.setUserDetail(userDetail);
        userRepository.save(user);

        return userMapper.toUserResponse(user);
    }

    @Override
    public AuthenticationResponse login(LoginRequest request) {
        try {
            var token = keycloakRepository.exchangeUserToken(LoginTokenParam.builder()
                    .grant_type("password")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .username(request.getUsername())
                    .password(request.getPassword())
                    .scope("openid")
                    .build());

            return AuthenticationResponse.builder()
                    .accessToken(token.getAccessToken())
                    .expiresIn(token.getExpiresIn())
                    .refreshExpiresIn(token.getRefreshExpiresIn())
                    .refreshToken(token.getRefreshToken())
                    .tokenType(token.getTokenType())
                    .idToken(token.getIdToken())
                    .scope(token.getScope())
                    .build();
        } catch (FeignException e) {
            throw new AppException(ErrorCode.INVALID_USERNAME_PASSWORD);
        }
    }

    @Override
    public UserResponse updateUser(UserUpdateRequest request) {
        Long userId = AuthenUtil.getUserId();
        var user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);

        UserDetail userDetail = user.getUserDetail();
        userDetail.setAddress(request.getAddress());
        userDetail.setPhoneNumber(request.getPhoneNumber());
        userDetail.setUpdatedAt(Instant.now());
        userDetail.setDateOfBirth(request.getDateOfBirth());

        userDetailRepository.save(userDetail);

        user.setUserDetail(userDetail);
        return userMapper.toUserResponse(user);
    }

    @Override
    public Boolean deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));
            userRepository.delete(user);
            return true;
        } catch (FeignException exception) {
            throw errorNormalizer.handleKeyCloakException(exception);
        }
    }

    @Override
    public Boolean resetPassword(String email, String newPassword) {
        Long userId = AuthenUtil.getUserId();

        var user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setPassword(bCryptPasswordEncoder.encode(newPassword));
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean checkUserRole() {
        return AuthenUtil.isAdmin();
    }


    @Override
    public List<UserResponse> getAllUsers() {
        var users = userRepository.findAll();
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    public UserResponse getUserProfile() {
        Long userId = AuthenUtil.getUserId();

        var user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var detail = userDetailRepository.findByUid(userId).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHORIZED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        String url = googleDriveService.uploadImageToDrive(file, FolderType.AVATAR);
        return url;
    }

    @Override
    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toUserResponse(user);
    }

    @Override
    public Boolean changePassword(UserChangePassword request) {
        User user = userRepository.findById(AuthenUtil.getUserId()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        if (!bCryptPasswordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        user.setPassword(bCryptPasswordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean sendVerifyMail(String email) {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.INVALID_EMAIL));
        var otpCode = otpService.generateOtp(user.getEmail());
        String emailBody = loadOtpEmailTemplate(user.getUsername(), otpCode, "verify");
        mailService.sendEmail(user.getEmail(), otpCode + " là mã xác nhận của bạn.", emailBody);
        return true;
    }

    @Override
    public Boolean verifyOtpMail(String email, String otp) {
        return otpService.verifyOtp(email, otp);
    }

    @Override
    public Boolean sendVerifyResetPass(String email) {
        var user = userRepository.findByEmail(email).orElseThrow(
                () -> new AppException(ErrorCode.INVALID_EMAIL));
        var otpCode = otpService.generateOtp(user.getEmail());
        String emailBody = loadOtpEmailTemplate(user.getUsername(), otpCode, "reset");
        mailService.sendEmail(user.getEmail(), otpCode + " là mã xác nhận của bạn.", emailBody);
        return true;
    }

    @Override
    public Boolean verifyOtpResetPass(String email, String otp) {
        return otpService.verifyOtp(email, otp);
    }

    private TokenExchangeResponse getClientToken() {
        return keycloakRepository.exchangeToken(TokenExchangeParam.builder()
                .grant_type("client_credentials")
                .client_id(clientId)
                .client_secret(clientSecret)
                .build());
    }


    private String loadOtpEmailTemplate(String username, String otpCode, String typeEmail) {
        try {
            Path path = new ClassPathResource("static/otp_email.html").getFile().toPath();
            String emailBody = Files.readString(path, StandardCharsets.UTF_8);

            String title;
            String message;
            String footerMessage;

            if ("verify".equalsIgnoreCase(typeEmail)) {
                title = "Xác minh email";
                message = "Đây là mã OTP của bạn để xác minh địa chỉ email. Vui lòng sử dụng mã này trong vòng 30 phút:";
                footerMessage = "Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email hoặc liên hệ với chúng tôi.";
            } else if ("reset".equalsIgnoreCase(typeEmail)) {
                title = "Đặt lại mật khẩu";
                message = "Đây là mã OTP của bạn để đặt lại mật khẩu. Vui lòng sử dụng mã này trong vòng 30 phút:";
                footerMessage = "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.";
            } else {
                throw new IllegalArgumentException("Loại email không hợp lệ: " + typeEmail);
            }

            // Thay thế các placeholder
            emailBody = emailBody.replace("{{title}}", title);
            emailBody = emailBody.replace("{{username}}", username.toUpperCase());
            emailBody = emailBody.replace("{{message}}", message);
            emailBody = emailBody.replace("{{otpCode}}", otpCode);
            emailBody = emailBody.replace("{{footerMessage}}", footerMessage);

            return emailBody;
        } catch (Exception e) {
            throw new RuntimeException("Không thể load template email OTP", e);
        }
    }

}
