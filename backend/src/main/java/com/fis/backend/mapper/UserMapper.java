package com.fis.backend.mapper;

import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.request.UserUpdateRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserRequest userRequest);
    User toUser(RegistrationRequest registrationRequest);
    UserResponse toUserResponse(User user);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
//    default String map(MultipartFile avatarFile) {
//        if (avatarFile == null) {
//            return null;
//        }
//        return "https://drive.google.com/file/d/120KeZyc7Udd0bx0A94Ser03rxZRnfuu4/view?usp=drive_link";
//    }
}
