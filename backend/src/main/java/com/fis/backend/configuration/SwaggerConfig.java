package com.fis.backend.configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customizeOpenAPI() {
        List<Server> servers = new ArrayList<>();
        final String securitySchemeName = "bearerAuth";
        servers.add(new Server().url("http://localhost:8070"));

        return new OpenAPI()
                .servers(servers)
                .addSecurityItem(new SecurityRequirement()
                        .addList(securitySchemeName))
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }

//    @Bean
//    public OperationCustomizer customizeMultipartOperation() {
//        return (operation, handlerMethod) -> {
//            if (operation.getRequestBody() != null
//                    && operation.getRequestBody().getContent().containsKey("multipart/form-data")) {
//
//                Schema<?> schema = new ObjectSchema();
//                // Định nghĩa property cho đối tượng JSON (ProductRequest)
//                schema.addProperty("request", new ObjectSchema().description("ProductRequest JSON"));
//                // Định nghĩa property cho file
//                schema.addProperty("file", new StringSchema().format("binary").description("File upload"));
//
//                operation.getRequestBody().getContent().put("multipart/form-data", new MediaType().schema(schema));
//            }
//            return operation;
//        };
//    }
}