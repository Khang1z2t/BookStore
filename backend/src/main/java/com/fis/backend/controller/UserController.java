package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.UserUpdateRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "API lấy thông tin tất cả tài khoản")
    ApiResponse<List<UserResponse>> getAllProfiles() {
        return ApiResponse.<List<UserResponse>>builder()
                .code(200)
                .data(userService.getAllUsers())
                .build();
    }

    @GetMapping("/profile")
    @Operation(summary = "API lấy thông tin tài khoản")
    ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .data(userService.getUserProfile())
                .build());
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "API cập nhật thông tin tài khoản")
    ResponseEntity<ApiResponse<UserResponse>> updateProfile(@ModelAttribute UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .data(userService.updateUser(request))
                .build());
    }

}
