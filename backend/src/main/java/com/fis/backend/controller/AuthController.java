package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    UserService userService;

    @PostMapping("/register")
    @Operation(summary = "API đăng kí tài khoản mới")
    ResponseEntity<ApiResponse<UserResponse>> register(@ModelAttribute RegistrationRequest request) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .data(userService.register(request))
                .build());
    }

    @PostMapping("/login")
    @Operation(summary = "API đăng nhập")
    ResponseEntity<ApiResponse<AuthenticationResponse>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .data(userService.login(request))
                .build());
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "API refresh token")
    ResponseEntity<ApiResponse<AuthenticationResponse>> refreshToken(@RequestParam String refreshToken) {
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .data(userService.refreshToken(refreshToken))
                .build());
    }

    @GetMapping("/check-role")
    @Operation(summary = "API kiểm tra quyền")
    ResponseEntity<ApiResponse<String>> checkRole() {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.checkUserRole() ? "admin" : "user")
                .build());
    }
}
