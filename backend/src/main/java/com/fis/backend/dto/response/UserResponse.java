package com.fis.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;
    String username;
    String email;
    String firstName;
    String lastName;
    String address;
    String phoneNumber;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    LocalDateTime dateOfBirth;
    String avatarUrl;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    Instant createdAt;
    //    @DateTimeFormat(pattern = "dd-MM-yyyy")
    Instant updatedAt;
}
