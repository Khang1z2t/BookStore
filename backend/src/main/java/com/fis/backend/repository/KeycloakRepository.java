package com.fis.backend.repository;

import com.fis.backend.dto.identity.*;
import feign.QueryMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "identity-client", url = "${keycloak.url}")
public interface KeycloakRepository {

    @PostMapping(value = "/realms/bookstore/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenExchangeResponse exchangeToken(@QueryMap TokenExchangeParam params);

    @PostMapping(value = "/admin/realms/bookstore/users",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> createUser(
            @RequestHeader("Authorization") String token,
            @RequestBody UserCreationParam param);

    @PostMapping(value = "/realms/bookstore/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    LoginTokenResponse exchangeUserToken(@QueryMap LoginTokenParam params);

    @PutMapping(value = "/admin/realms/bookstore/users/{userId}",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String token,
            @PathVariable("userId") String userId,
            @RequestBody UserUpdateParam param);


    @DeleteMapping(value = "/admin/realms/bookstore/users/{userId}",
            consumes = MediaType.APPLICATION_JSON_VALUE)
    ResponseEntity<?> deleteUser(
            @RequestHeader("authorization") String token,
            @PathVariable("userId") String userId);

    @PostMapping(value = "/realms/bookstore/protocol/openid-connect/token",
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    LoginTokenResponse refreshToken(
            @RequestHeader("Authorization") String token,
            @QueryMap RefreshTokenParam params);

}
