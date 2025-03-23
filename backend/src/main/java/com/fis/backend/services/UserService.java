package com.fis.backend.services;

import com.fis.backend.dto.request.*;
import com.fis.backend.dto.response.AuthenticationResponse;
import com.fis.backend.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {

    AuthenticationResponse refreshToken(String refreshToken);

    UserResponse register(RegistrationRequest request);

    AuthenticationResponse login(LoginRequest request);

    UserResponse updateUser(UserUpdateRequest request);

    Boolean deleteUser(Long userId);

    Boolean resetPassword(String email, String newPassword);

    Boolean checkUserRole();

    List<UserResponse> getAllUsers();

    UserResponse getUserProfile();

    String uploadImage(MultipartFile file);

    UserResponse getUserById(Long userId);

    Boolean changePassword(UserChangePassword request);

    Boolean sendVerifyMail(String email);

    Boolean verifyOtpMail(String email, String otp);

    Boolean sendVerifyResetPass(String email);

    Boolean verifyOtpResetPass(String email, String otp);
}
