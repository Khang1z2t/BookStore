package com.fis.backend.mapper;

import com.fis.backend.dto.UserDetailReportDTO;
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

    @Mapping(source = "userDetail.address", target = "address")
    @Mapping(source = "userDetail.phoneNumber", target = "phoneNumber")
    @Mapping(source = "userDetail.dateOfBirth", target = "dateOfBirth")
    @Mapping(source = "userDetail.avatarUrl", target = "avatarUrl")
    @Mapping(source = "userDetail.createdAt", target = "createdAt")
    @Mapping(source = "userDetail.updatedAt", target = "updatedAt")
    UserResponse toUserResponse(User user);

    @Mapping(source = "userDetail.address", target = "address")
    @Mapping(source = "userDetail.phoneNumber", target = "phoneNumber")
    @Mapping(source = "userDetail.dateOfBirth", target = "dateOfBirth")
    @Mapping(source = "userDetail.createdAt", target = "createdAt")
    UserDetailReportDTO toUserDetailReportDTO(User user);

    User toUser(UserRequest userRequest);
    User toUser(RegistrationRequest registrationRequest);
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
//    default String map(MultipartFile avatarFile) {
//        if (avatarFile == null) {
//            return null;
//        }
//        return "https://drive.google.com/file/d/120KeZyc7Udd0bx0A94Ser03rxZRnfuu4/view?usp=drive_link";
//    }
}
