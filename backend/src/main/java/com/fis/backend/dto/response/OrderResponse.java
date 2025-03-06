package com.fis.backend.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    private String id;
    private Long userId;
    private Double totalPrice;
    private Double totalProduct;
    private String orderInfo;
    private String status;
    private List<OrderDetailResponse> orderDetails = new ArrayList<>();
}
