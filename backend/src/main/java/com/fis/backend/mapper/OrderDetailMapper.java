package com.fis.backend.mapper;

import com.fis.backend.dto.request.OrderDetailRequest;
import com.fis.backend.dto.response.OrderDetailResponse;
import com.fis.backend.entity.OrderDetail;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@FieldDefaults(makeFinal = true)
public class OrderDetailMapper {
    private ModelMapper modelMapper;

    public OrderDetail toOrderDetail(OrderDetailRequest orderDetailRequest) {
        return modelMapper.map(orderDetailRequest, OrderDetail.class);
    }

    public OrderDetail toOrderDetail(OrderDetailResponse orderDetailResponse) {
        return modelMapper.map(orderDetailResponse, OrderDetail.class);
    }

    public List<OrderDetail> toOrderDetailList(List<OrderDetailResponse> orderDetailResponseList) {
        return orderDetailResponseList.stream().map(this::toOrderDetail).toList();
    }

    public OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail) {
        return modelMapper.map(orderDetail, OrderDetailResponse.class);
    }


}
