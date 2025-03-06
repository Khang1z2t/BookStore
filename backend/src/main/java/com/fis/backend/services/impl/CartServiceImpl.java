package com.fis.backend.services.impl;

import com.fis.backend.dto.request.AddCartRequest;
import com.fis.backend.dto.request.EditCartRequest;
import com.fis.backend.dto.response.CartResponse;
import com.fis.backend.entity.Cart;
import com.fis.backend.entity.CartItem;
import com.fis.backend.entity.Product;
import com.fis.backend.entity.User;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.mapper.CartMapper;
import com.fis.backend.repository.CartItemRepository;
import com.fis.backend.repository.CartRepository;
import com.fis.backend.repository.ProductRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.CartService;
import com.fis.backend.utils.AuthenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartMapper cartMapper;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    @Override
    public CartResponse addCart(AddCartRequest request) {
        User user = userRepository.findById(AuthenUtil.getUserId()).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Product product = productRepository.findById(request.getProductId()).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHENTICATED));

        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(request.getProductId()))
                .findFirst();

        if (existingItem.isPresent()) {
            existingItem.get().setQuantity(existingItem.get().getQuantity() + request.getQuantity());
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setCart(cart);
            cartItem.setTotalPrice(product.getPrice() * request.getQuantity());
//            cartItemRepository.save(cartItem);
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
        return cartMapper.toCartResponse(cart);
    }

    @Override
    public CartResponse editCart(EditCartRequest request) {
        CartItem cartItem = cartItemRepository.findById(request.getCartItemId()).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHORIZED));
        if (request.getQuantity() <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(request.getQuantity());
            cartItemRepository.save(cartItem);
        }
        return cartMapper.toCartResponse(cartItem.getCart());
    }

    @Override
    public Boolean deleteCart(String cartItemId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId).orElseThrow(
                () -> new AppException(ErrorCode.UNAUTHORIZED));
        cartItemRepository.delete(cartItem);
        return true;
    }

    @Override
    public CartResponse getCartByUser() {
        Long userId = AuthenUtil.getUserId();
        User user = userRepository.findById(userId).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
        return cartMapper.toCartResponse(cart);
    }

    @Override
    @Transactional
    public Boolean deleteAllCartItemByUserId() {
        try {
            Long userId = AuthenUtil.getUserId();
            User user = userRepository.findById(userId).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));
            Cart cart = cartRepository.findByUser(user).orElseThrow(
                    () -> new AppException(ErrorCode.USER_NOT_EXISTED));

            cartItemRepository.deleteByCart(cart);
            return true;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
