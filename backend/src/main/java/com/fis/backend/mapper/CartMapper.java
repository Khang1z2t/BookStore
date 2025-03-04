package com.fis.backend.mapper;

import com.fis.backend.dto.request.AddCartRequest;
import com.fis.backend.dto.response.CartItemResponse;
import com.fis.backend.dto.response.CartResponse;
import com.fis.backend.entity.Cart;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class CartMapper {
    ModelMapper modelMapper;

    public Cart toCart(AddCartRequest cartRequest) {
        return modelMapper.map(cartRequest, Cart.class);
    }

    public CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> new CartItemResponse(
                        item.getProduct().getId(),
                        item.getQuantity(),
                        item.getTotalPrice()
                ))
                .collect(Collectors.toList());


        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setItems(items);
        return response;
    }

    public List<CartResponse> toCartResponseList(List<Cart> cartList) {
        return cartList.stream().map(this::toCartResponse).toList();
    }
}
