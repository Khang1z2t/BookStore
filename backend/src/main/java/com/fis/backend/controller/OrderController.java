package com.fis.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.CreateOrderRequest;
import com.fis.backend.dto.request.UpdateOrderRequest;
import com.fis.backend.dto.response.OrderResponse;
import com.fis.backend.services.OrderService;
import com.fis.backend.utils.Constants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;
    TaskService taskService;

    @GetMapping("/all")
    @Operation(summary = "Get all orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.getAllOrder()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order by `id`")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.getOrderById(id)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get all orders by `status`")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStatus(@PathVariable String status) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.getAllOrderByStatus(status)));
    }

    @PostMapping
    @Operation(summary = "Create order with list of `products`")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.createOrder(request)));
    }

    @PostMapping("/{id}")
    @Operation(summary = "Update order with `id`")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(@PathVariable String id, @RequestBody UpdateOrderRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.updateOrder(id, request)));
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<ApiResponse<OrderResponse>> receiveOrder(@PathVariable String id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.receiveOrder(id)));
    }

    @GetMapping("/all/user")
    @Operation(summary = "Get all by user")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllByUser() {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.getAllOrderByUser()));
    }
}
