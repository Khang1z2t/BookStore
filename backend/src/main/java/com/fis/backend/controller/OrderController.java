package com.fis.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.CreateOrderRequest;
import com.fis.backend.dto.request.UpdateOrderRequest;
import com.fis.backend.dto.response.OrderResponse;
import com.fis.backend.services.OrderService;
import com.fis.backend.utils.Constants;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.task.Task;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class OrderController {
    OrderService orderService;
    TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.createOrder(request)));
    }

    @PostMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(@PathVariable String id, @RequestBody UpdateOrderRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.updateOrder(id, request)));
    }

    @PostMapping("/{id}/receive")
    public ResponseEntity<ApiResponse<OrderResponse>> receiveOrder(@PathVariable String id) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", orderService.receiveOrder(id)));
    }
}
