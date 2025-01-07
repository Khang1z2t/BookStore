package com.fis.backend.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RegistrationRequest {
    @Size(min = 4, message = "INVALID_USERNAME")
    @Schema(description = "Tên đăng nhập", example = "user123")
    String username;

    @Size(min = 6, message = "INVALID_PASSWORD")
    @JsonProperty(value = "password", required = true)
    @Schema(description = "Mật khẩu của tài khoản", example = "password123")
    String password;
    String email;
    String firstName;
    String lastName;
}
