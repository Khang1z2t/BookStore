package com.fis.backend.repository;

import com.fis.backend.entity.Order;
import com.fis.backend.entity.OrderDetail;
import com.fis.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, String> {
    Optional<OrderDetail> findByOrderAndProductId(Order order, String productId);
}
