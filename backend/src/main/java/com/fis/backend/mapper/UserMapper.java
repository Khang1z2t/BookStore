package com.fis.backend.mapper;

import com.fis.backend.dto.request.RegistrationRequest;
import com.fis.backend.dto.request.UserRequest;
import com.fis.backend.dto.response.UserResponse;
import com.fis.backend.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "avatarUrl", source = "avatarUrl")
    User toUser(UserRequest userRequest);
    User toUser(RegistrationRequest registrationRequest);
    UserResponse toUserResponse(User user);
    default String map(MultipartFile avatarFile) {
        if (avatarFile == null) {
            return null;
        }
        return "https://drive.google.com/file/d/120KeZyc7Udd0bx0A94Ser03rxZRnfuu4/view?usp=drive_link";
    }
}
