package com.fis.backend.services;

import com.fis.backend.dto.request.AddCartRequest;
import com.fis.backend.dto.request.EditCartRequest;
import com.fis.backend.dto.response.CartResponse;

import java.util.List;

public interface CartService {
    CartResponse addCart(AddCartRequest request);

    CartResponse editCart(EditCartRequest request);

    Boolean deleteCart(String cartId);

    CartResponse getCartByUser();
}
