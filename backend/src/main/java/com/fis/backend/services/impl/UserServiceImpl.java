package com.fis.backend.services.impl;

import com.fis.backend.dto.identity.*;
import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.request.UserUpdateRequest;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.exception.ErrorNormalizer;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.repository.KeycloakRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.GoogleDriveService;
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
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    GoogleDriveService googleDriveService;
    KeycloakRepository keycloakRepository;
    ErrorNormalizer errorNormalizer;

    @Value("${keycloak.client-id}")
    @NonFinal
    String clientId;

    @Value("${keycloak.client-secret}")
    @NonFinal
    String clientSecret;

    @Override
    public UserResponse register(RegistrationRequest request) {
        try {
            // Create account in KeyCloak
            // Exchange client Token
            var token = getClientToken();
            // Create user with client Token and given info

            // Get profileId of keyCloak account
            var creationResponse = keycloakRepository.createUser(
                    "Bearer " + token.getAccessToken(),
                    UserCreationParam.builder()
                            .username(request.getUsername())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .email(request.getEmail())
                            .enabled(true)
                            .emailVerified(false)
                            .credentials(List.of(Credential.builder()
                                    .type("password")
                                    .value(request.getPassword())
                                    .temporary(false)
                                    .build()))
                            .build());

            var profileId = extractProfileId(creationResponse);

            var user = userMapper.toUser(request);
            user.setProfileId(profileId);
            user.setAvatarUrl("https://drive.google.com/file/d/120KeZyc7Udd0bx0A94Ser03rxZRnfuu4/view?usp=drive_link");
            user = userRepository.save(user);

            return userMapper.toUserResponse(user);
        } catch (FeignException e) {
            throw errorNormalizer.handleKeyCloakException(e);
        }
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
        try {
            var user = userRepository.findByProfileId(AuthenUtil.getProfileId()).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));
            var token = getClientToken();

            var response = keycloakRepository.updateUser(
                    "Bearer " + token.getAccessToken(),
                    user.getProfileId(),
                    UserUpdateParam.builder()
                            .email(request.getEmail())
                            .firstName(request.getFirstName())
                            .lastName(request.getLastName())
                            .enabled(true)
                            .build());
            if (!response.getStatusCode().is2xxSuccessful()) {
                throw new AppException(ErrorCode.USER_NOT_EXISTED); //USER_UPDATE_FAILED
            }

            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            if (request.getFirstName() != null) {
                user.setFirstName(request.getFirstName());
            }
            if (request.getLastName() != null) {
                user.setLastName(request.getLastName());
            }
            if (request.getPhone() != null) {
                user.setPhone(request.getPhone());
            }
            if (request.getAddress() != null) {
                user.setAddress(request.getAddress());
            }
            if (request.getBirthday() != null) {
                user.setBirthday(request.getBirthday());
            }

            if (request.getAvatarUrl() != null && !request.getAvatarUrl().isEmpty()) {
                String avatarUrl = googleDriveService.uploadImageToDrive(request.getAvatarUrl(), FolderType.AVATAR);
                user.setAvatarUrl(avatarUrl);
            }


            user = userRepository.save(user);
            return userMapper.toUserResponse(user);
        } catch (FeignException e) {
            throw errorNormalizer.handleKeyCloakException(e);
        }
    }

    @Override
    public List<UserResponse> getAllUsers() {
        var users = userRepository.findAll();
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    public UserResponse getUserProfile() {
        String profileId = AuthenUtil.getProfileId();

        var user = userRepository.findByProfileId(profileId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public String uploadImage(MultipartFile file) {
        String url = googleDriveService.uploadImageToDrive(file, FolderType.AVATAR);
        return url;
    }

    private TokenExchangeResponse getClientToken() {
        return keycloakRepository.exchangeToken(TokenExchangeParam.builder()
                .grant_type("client_credentials")
                .client_id(clientId)
                .client_secret(clientSecret)
                .build());
    }

    private String extractProfileId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").getFirst();
        String[] splitedStr = location.split("/");
        return splitedStr[splitedStr.length - 1];
    }
}
