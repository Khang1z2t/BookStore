package com.fis.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class UserDetailReportDTO {
    Long id;
    String username;
    String firstName;
    String lastName;
    String email;
    String address;
//
//    @JsonProperty("phone_number")
    String phoneNumber;
//
//    @JsonProperty("date_of_birth")
    Date dateOfBirth;
//
//    @JsonProperty("created_at")
    Instant createdAt;
}
