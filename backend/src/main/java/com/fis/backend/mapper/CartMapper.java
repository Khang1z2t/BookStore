package com.fis.backend.mapper;

import com.fis.backend.dto.request.AddCartRequest;
import com.fis.backend.dto.response.CartItemResponse;
import com.fis.backend.dto.response.CartResponse;
import com.fis.backend.entity.Cart;
import com.fis.backend.entity.CartItem;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.Comparator;
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
                .sorted(Comparator.comparing(CartItem::getCreatedAt).reversed())
                .map(item -> new CartItemResponse(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getQuantity(),
                        item.getTotalPrice(),
                        item.getCreatedAt(),
                        item.getUpdatedAt()
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
