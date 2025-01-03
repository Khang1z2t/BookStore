package com.fis.backend.services.impl;

import com.fis.backend.dto.identity.Credential;
import com.fis.backend.dto.identity.TokenExchangeParam;
import com.fis.backend.dto.identity.UserCreationParam;
import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.exception.ErrorNormalizer;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.repository.IdentityClient;
import com.fis.backend.repository.UserReponsitory;
import com.fis.backend.services.UserService;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserReponsitory userReponsitory;
    UserMapper userMapper;
    IdentityClient identityClient;
    ErrorNormalizer errorNormalizer;
    GoogleDriveService googleDriveService;

    @Value("${idp.client-id}")
    @NonFinal
    String clientId;

    @Value("${idp.client-secret}")
    @NonFinal
    String clientSecret;

    @Override
    public List<UserResponse> getAllUsers() {
        var users = userReponsitory.findAll();
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    public UserResponse register(UserRequest request) {
        try {
            // Create account in KeyCloak
            // Exchange client Token
            var token = identityClient.exchangeToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());

            log.info("Token: {}", token);
            // Create user with client Token and given info

            // Get profileId of keyCloak account
            var creationResponse = identityClient.createUser(
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
            String avt = googleDriveService.uploadImageToDrive(request.getAvatarUrl());

            var user = userMapper.toUser(request);
            user.setAvatarUrl(avt);
            user.setProfileId(profileId);
            user = userReponsitory.save(user);

            return userMapper.toUserResponse(user);
        } catch (FeignException e) {
            throw errorNormalizer.handleKeyCloakException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public UserResponse getUserProfile() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String profileId = authentication.getName();

        var user = userReponsitory.findByProfileId(profileId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        String url = googleDriveService.uploadImageToDrive(file);
        return url;
    }

    private String extractProfileId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").getFirst();
        String[] splitedStr = location.split("/");
        return splitedStr[splitedStr.length - 1];
    }
}
