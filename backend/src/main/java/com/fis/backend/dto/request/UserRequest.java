package com.fis.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
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
public class UserRequest {
    @Size(min = 4, message = "INVALID_USERNAME")
    @Schema(description = "Tên đăng nhập", example = "khang")
    String username;

    @Size(min = 6, message = "INVALID_PASSWORD")
    @JsonProperty(value = "password", required = true)
    @Schema(description = "Mật khẩu của tài khoản", example = "12345678")
    String password;
    String email;
    String firstName;
    String lastName;
    String phone;
    String address;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    LocalDate birthday;
    @Nullable
    MultipartFile avatarUrl;
}
