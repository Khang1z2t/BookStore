package com.fis.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String email;
    String firstName;
    String lastName;
    String phone;
    String address;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate birthday;
    MultipartFile avatarUrl;
}
