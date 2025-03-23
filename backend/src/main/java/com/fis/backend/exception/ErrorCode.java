package com.fis.backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Uncategorized error", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME(1003, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(1004, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1007, "You do not have permission", HttpStatus.FORBIDDEN),
    USERNAME_EXISTED(1008, "Username already existed", HttpStatus.BAD_REQUEST),
    EMAIL_EXISTED(1009, "Email existed, please choose another one", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1010, "Username existed, please choose another one", HttpStatus.BAD_REQUEST),
    USERNAME_IS_MISSING(1011, "Please enter username", HttpStatus.BAD_REQUEST),
    USER_NOT_EXISTED(1012, "User not existed", HttpStatus.BAD_REQUEST),
    INVALID_USERNAME_PASSWORD(1013, "Invalid username or password", HttpStatus.UNAUTHORIZED),
    INVALID_DRIVE_TOKEN(1014, "Invalid drive token", HttpStatus.BAD_REQUEST),
    INVALID_REFRESH_TOKEN(1015, "Invalid refresh token", HttpStatus.BAD_REQUEST),
    INVALID_EMAIL(1016, "Invalid email", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private final int code;
    private final HttpStatusCode statusCode;
    private final String message;
}
