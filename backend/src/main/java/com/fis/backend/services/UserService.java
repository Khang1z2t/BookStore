package com.fis.backend.services;

import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    public List<UserResponse> getAllUsers();

    public UserResponse register(UserRequest request);

    public UserResponse getUserProfile();
}
