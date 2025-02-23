package com.fis.backend.services;

import com.fis.backend.dto.request.CreateOrderRequest;
import com.fis.backend.dto.request.UpdateOrderRequest;
import com.fis.backend.dto.response.OrderResponse;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse updateOrder(String id, UpdateOrderRequest request);

    OrderResponse receiveOrder(String id);
}
