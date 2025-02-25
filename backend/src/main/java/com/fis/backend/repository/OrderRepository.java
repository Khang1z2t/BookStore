package com.fis.backend.repository;

import com.fis.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByBusinessKey(String businessKey);
    Order findFirstByOrderByOrderInfoDesc();

}
