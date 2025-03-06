package com.fis.backend.controller;

import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.AddCartRequest;
import com.fis.backend.dto.request.EditCartRequest;
import com.fis.backend.dto.response.CartResponse;
import com.fis.backend.services.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<CartResponse>> addCart(@RequestBody AddCartRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", cartService.addCart(request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCartByUser() {
        return ResponseEntity.ok(new ApiResponse<>(200, "", cartService.getCartByUser()));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<CartResponse>> updateCartByUser(@RequestBody EditCartRequest editCartRequest) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", cartService.editCart(editCartRequest)));
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteCartByUser(@PathVariable String cartItemId) {
        return ResponseEntity.ok(new ApiResponse<>(200, "", cartService.deleteCart(cartItemId)));
    }

    @DeleteMapping("/user")
    public ResponseEntity<ApiResponse<Boolean>> deleteCartByUser() {
        return ResponseEntity.ok(new ApiResponse<>(200, "", cartService.deleteAllCartItemByUserId()));
    }
}
