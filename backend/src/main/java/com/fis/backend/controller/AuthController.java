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

import static org.springframework.http.HttpStatus.NOT_FOUND;

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

    @PostMapping("/send-verification")
    @Operation(summary = "API gửi mail xác thực")
    ResponseEntity<ApiResponse<String>> sendVerifyMail(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.sendVerifyMail(email) ? "Gửi mail thành công" : "Gửi mail thất bại")
                .build());
    }


    @PostMapping("/verify-otp")
    @Operation(summary = "API xác thực OTP mail")
    ResponseEntity<ApiResponse<String>> verifyOtpMail(@RequestParam String email, @RequestParam String otp) {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.verifyOtpMail(email, otp) ? "Xác thực thành công" : "Xác thực thất bại")
                .build());
    }

    @PostMapping("/send-reset-password")
    @Operation(summary = "API gửi mail xác thực reset password")
    ResponseEntity<ApiResponse<String>> sendVerifyResetPass(@RequestParam String email) {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.sendVerifyResetPass(email) ? "Gửi mail thành công" : "Gửi mail thất bại")
                .build());
    }

    @PostMapping("/verify-reset-otp")
    @Operation(summary = "API xác thực OTP reset password")
    ResponseEntity<ApiResponse<String>> verifyOtpResetPass(@RequestParam String email, @RequestParam String otp) {
        return ResponseEntity.ok(ApiResponse.<String>builder()
                .data(userService.verifyOtpResetPass(email, otp) ? "Xác thực thành công" : "Xác thực thất bại")
                .build());
    }

    @PutMapping("/reset-password")
    @Operation(summary = "API reset mật khẩu")
    ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam String email, @RequestParam String newPassword) {
        try {
            boolean result = userService.resetPassword(email, newPassword);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .data(result ? "Cập nhật mật khẩu thành công" : "Cập nhật mật khẩu thất bại")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(NOT_FOUND).body(ApiResponse.<String>builder()
                    .data("Cập nhật mật khẩu thất bại")
                    .build());
        }
    }

}
