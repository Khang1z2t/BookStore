package com.fis.backend.services.impl;

import com.fis.backend.dto.identity.Credential;
import com.fis.backend.dto.identity.LoginTokenParam;
import com.fis.backend.dto.identity.TokenExchangeParam;
import com.fis.backend.dto.identity.UserCreationParam;
import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.exception.ErrorNormalizer;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.repository.KeycloakRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.GoogleDriveService;
import com.fis.backend.services.KeycloakService;
import feign.FeignException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class KeycloakServiceImpl implements KeycloakService {
    UserRepository userRepository;
    UserMapper userMapper;
    KeycloakRepository keycloakRepository;
    ErrorNormalizer errorNormalizer;
    GoogleDriveService googleDriveService;

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
            var token = keycloakRepository.exchangeToken(TokenExchangeParam.builder()
                    .grant_type("client_credentials")
                    .client_id(clientId)
                    .client_secret(clientSecret)
                    .scope("openid")
                    .build());
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
            throw errorNormalizer.handleKeyCloakException(e);
        }
    }

    private String extractProfileId(ResponseEntity<?> response) {
        String location = response.getHeaders().get("Location").getFirst();
        String[] splitedStr = location.split("/");
        return splitedStr[splitedStr.length - 1];
    }
}
