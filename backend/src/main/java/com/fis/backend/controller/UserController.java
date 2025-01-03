package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API đăng kí tài khoản mới")
    ApiResponse<UserResponse> register(@ModelAttribute UserRequest request) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.register(request))
                .build();
    }

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    ApiResponse<List<UserResponse>> getAllProfiles() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        return ApiResponse.<List<UserResponse>>builder()
                .code(200)
                .result(userService.getAllUsers())
                .build();
    }

    @GetMapping("/profile")
    ApiResponse<UserResponse> getProfile() {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getUserProfile())
                .build();
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API tải hình ảnh")
    ApiResponse<String> register(@RequestPart(name = "fileImg", required = true) MultipartFile fileImg) throws IOException {
        return ApiResponse.<String>builder()
                .result(userService.uploadImage(fileImg))
                .build();
    }
}
