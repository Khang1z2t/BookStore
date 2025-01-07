package com.fis.backend.services.impl;

import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.mapper.UserMapper;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.GoogleDriveService;
import com.fis.backend.services.UserService;
import com.fis.backend.utils.AuthenUtil;
import com.fis.backend.utils.enums.FolderType;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    GoogleDriveService googleDriveService;


    @Override
    public List<UserResponse> getAllUsers() {
        var users = userRepository.findAll();
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    public UserResponse getUserProfile() {
        String profileId = AuthenUtil.getProfileId();

        var user = userRepository.findByProfileId(profileId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @Override
    public String uploadImage(MultipartFile file) throws IOException {
        String url = googleDriveService.uploadImageToDrive(file, FolderType.AVATAR);
        return url;
    }

//Update information(update trong db)
//Update password
}
