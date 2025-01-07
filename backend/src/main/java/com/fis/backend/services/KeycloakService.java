package com.fis.backend.services;

import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;

public interface KeycloakService {
    UserResponse register(RegistrationRequest request);

    AuthenticationResponse login(LoginRequest request);
}
