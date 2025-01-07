package com.fis.backend.services;

import com.fis.backend.dto.request.LoginRequest;
import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface UserService {

    List<UserResponse> getAllUsers();

    UserResponse getUserProfile();

    String uploadImage(MultipartFile file) throws IOException;
}
