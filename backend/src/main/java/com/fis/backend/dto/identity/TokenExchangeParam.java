package com.fis.backend.dto.identity;

import lombok.*;
import lombok.experimental.FieldDefaults;

import static lombok.AccessLevel.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = PRIVATE)
public class TokenExchangeParam {
    String grant_type;
    String client_id;
    String client_secret;
    String scope;
}
