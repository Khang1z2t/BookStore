package com.fis.backend.dto.identity;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.*;
        import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class LoginTokenResponse {
    String accessToken;
    String expiresIn;
    String refreshExpiresIn;
    String refreshToken;
    String tokenType;
    String idToken;
    String scope;
}
