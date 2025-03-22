package com.fis.backend.services;

import com.fis.backend.dto.request.CreateOrderRequest;
import com.fis.backend.dto.request.UpdateOrderRequest;
import com.fis.backend.dto.response.OrderResponse;

import java.util.List;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse updateOrder(String id, UpdateOrderRequest request);

    OrderResponse receiveOrder(String id);

    List<OrderResponse> getAllOrder();

    OrderResponse getOrderById(String id);

    List<OrderResponse> getAllOrderByStatus(String status);

    List<OrderResponse> getAllOrderByUser();
}
