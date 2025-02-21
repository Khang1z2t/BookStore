package com.fis.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductRequest {
    @Schema(description = "Tên sản phẩm", example = "Hồi kí Yuno")
    String name;
    @Schema(description = "Mô tả sản phẩm", example = "Hồi kí của Yuno")
    String description;
    @Schema(description = "Giá sản phẩm", example = "100000")
    Double price;
    @Schema(description = "Link ảnh sản phẩm", example = "https://www.google.com")
    String imageUrl;
    @Schema(description = "Số lượng sản phẩm", example = "100")
    Integer quantity;
}
