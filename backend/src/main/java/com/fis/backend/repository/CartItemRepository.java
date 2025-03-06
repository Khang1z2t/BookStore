package com.fis.backend.repository;

import com.fis.backend.entity.Cart;
import com.fis.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, String> {
    void deleteByCart(Cart cart);
}
