package com.fis.backend.repository;

import com.fis.backend.entity.Cart;
import com.fis.backend.entity.Product;
import com.fis.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, String> {
    List<Cart> findAllByUser(User user);

    Optional<Cart> findByUser(User user);
}
