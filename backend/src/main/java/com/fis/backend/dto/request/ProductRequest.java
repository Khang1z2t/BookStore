package com.fis.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    @Schema(description = "Tên sản phẩm", example = "Oshi no ko Vol")
    String name;
    @Schema(description = "Mô tả sản phẩm", example = "Ai is very kawaii")
    String description;
    @Schema(description = "Giá sản phẩm", example = "100000")
    Double price;
    @Schema(description = "Số lượng sản phẩm", example = "100")
    Integer quantity;
}
