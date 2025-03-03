package com.fis.backend.mapper;

import com.fis.backend.dto.response.OrderResponse;
import com.fis.backend.entity.Order;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderMapper {
    private final ModelMapper modelMapper;

    public OrderResponse toOrderResponse(Order order) {
        return modelMapper.map(order, OrderResponse.class);
    }

    public List<OrderResponse> toOrderResponseList(List<Order> orders) {
        return orders.stream().map(this::toOrderResponse).toList();
    }
}
