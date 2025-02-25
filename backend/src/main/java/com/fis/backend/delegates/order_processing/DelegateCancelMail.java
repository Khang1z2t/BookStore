package com.fis.backend.delegates.order_processing;

import com.fis.backend.entity.Order;
import com.fis.backend.repository.OrderRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DelegateCancelMail implements JavaDelegate {
    private final OrderRepository orderRepository;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String businessKey = delegateExecution.getProcessBusinessKey();

        Order order = orderRepository.findByBusinessKey(businessKey)
                .orElseThrow(() -> new NotFoundException("Order not found"));
    }
}
