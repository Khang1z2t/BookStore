package com.fis.backend.dto.identity;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateParam {
    String email;
    String firstName;
    String lastName;
    boolean emailVerified;
    boolean enabled;
}
