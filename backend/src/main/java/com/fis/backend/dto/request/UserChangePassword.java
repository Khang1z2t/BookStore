package com.fis.backend.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserChangePassword {
    String oldPassword;
    String newPassword;
    String confirmPassword;
}
