package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.UserUpdateRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.entity.User;
import com.fis.backend.exception.AppException;
import com.fis.backend.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

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

    @PutMapping("/update")
    @Operation(summary = "API cập nhật thông tin tài khoản")
    ResponseEntity<ApiResponse<UserResponse>> updateProfile(@RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .data(userService.updateUser(request))
                .build());
    }

    @PutMapping("/reset-password")
    @Operation(summary = "API reset mật khẩu")
    ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam String newPassword) {
        try {
            boolean result = userService.resetPassword(newPassword);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .data(result ? "Cập nhật mật khẩu thành công" : "Cập nhật mật khẩu thất bại")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(ApiResponse.<String>builder()
                    .data("Cập nhật mật khẩu thất bại")
                    .build());
        }
    }

    @DeleteMapping("/delete/{userId}")
    @Operation(summary = "API xóa tài khoản")
    ResponseEntity<ApiResponse<String>> deleteProfile(@PathVariable Long userId) {
        try {
            boolean result = userService.deleteUser(userId);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .data(result ? "Xóa tài khoản thành công" : "Xóa tài khoản thất bại")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(ApiResponse.<String>builder()
                    .data("Xóa tài khoản thất bại")
                    .build());
        }
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "API lấy thông tin tài khoản theo id")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", userService.getUserById(userId)));
    }

}
