package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
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
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublicController {
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
    ResponseEntity<ApiResponse<String>> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.login(request).getAccessToken())
                .build());
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API tải hình ảnh")
    ApiResponse<String> register(@RequestPart(name = "fileImg", required = true) MultipartFile fileImg) throws IOException {
        return ApiResponse.<String>builder()
                .code(HttpStatus.OK.value())
                .data(userService.uploadImage(fileImg))
                .build();
    }
}
