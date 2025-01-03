package com.fis.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String userId;
    String profileId;
    String username;
    String email;
    String firstName;
    String lastName;
    String phone;
    String address;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate birthday;
    String avatarUrl;
}
