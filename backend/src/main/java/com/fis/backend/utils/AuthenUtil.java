package com.fis.backend.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Base64;

public class AuthenUtil {
    public static Long getUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        String name = authentication.getName();
        String id = name.split(":")[2];
        return Long.valueOf(id);
    }

    public static String encodeBasicAuth(String clientId, String clientSecret) {
        String credentials = clientId + ":" + clientSecret;
        return Base64.getEncoder().encodeToString(credentials.getBytes());
    }

}
