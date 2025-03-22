package com.fis.backend.repository;

import com.fis.backend.entity.Order;
import com.fis.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    Optional<Order> findByBusinessKey(String businessKey);
    Order findFirstByOrderByOrderInfoDesc();

    @Query(value = "SELECT * FROM orders WHERE order_info LIKE CONCAT('OD', TO_CHAR(NOW(), 'DDMMYY'), '%') ORDER BY CAST(SUBSTRING(order_info, 9, 3) AS INTEGER) DESC LIMIT 1", nativeQuery = true)
    Order findLatestOrderOfToday();

    List<Order> findAllByStatus(String status);

    List<Order> findAllByUser(User user);
}
