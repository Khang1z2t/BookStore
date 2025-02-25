package com.fis.backend.delegates.order_processing;

import com.fis.backend.entity.Order;
import com.fis.backend.entity.OrderDetail;
import com.fis.backend.entity.Product;
import com.fis.backend.repository.OrderRepository;
import com.fis.backend.repository.ProductRepository;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DelegateAutoProcessOrder implements JavaDelegate {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String orderId = (String) delegateExecution.getVariable("orderId");
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        List<OrderDetail> orderDetails = order.getOrderDetails();
        for(OrderDetail orderDetail : orderDetails) {
//            log.info("Processing order detail: {}", orderDetail);
            Product product = orderDetail.getProduct();
            product.setQuantity(product.getQuantity() - orderDetail.getQuantity());
            productRepository.save(product);
        }

        delegateExecution.setVariable("orderId", orderId);
    }
}
