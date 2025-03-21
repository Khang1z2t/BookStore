package com.fis.backend.delegates.order_processing;

import com.fis.backend.entity.Order;
import com.fis.backend.repository.OrderRepository;
import com.fis.backend.utils.enums.OrderStatus;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DelegateProcessOrderConfirmation implements JavaDelegate {
    private final OrderRepository orderRepository;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String orderId = (String) delegateExecution.getVariable("orderId");
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        order.setStatus(OrderStatus.CONFIRMED.toString());
        orderRepository.save(order);
        delegateExecution.setVariable("orderId", orderId);
    }
}
