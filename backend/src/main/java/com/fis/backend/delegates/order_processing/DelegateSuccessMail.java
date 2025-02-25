package com.fis.backend.delegates.order_processing;

import com.fis.backend.entity.Order;
import com.fis.backend.entity.OrderDetail;
import com.fis.backend.entity.User;
import com.fis.backend.repository.OrderRepository;
import com.fis.backend.utils.GenaratedId;
import jakarta.ws.rs.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

@Slf4j
@Component
@RequiredArgsConstructor
public class DelegateSuccessMail implements JavaDelegate {
    private final OrderRepository orderRepository;
    private final GenaratedId genaratedId;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String businessKey = delegateExecution.getProcessBusinessKey();

        Order order = orderRepository.findByBusinessKey(businessKey)
                .orElseThrow(() -> new NotFoundException("Order not found"));
    }

    private String loadEmailTemplate(Order order, User user) {
        try {
            Path path = new ClassPathResource("static/order_details.html").getFile().toPath();
            String emailBody = Files.readString(path, StandardCharsets.UTF_8);

            emailBody = emailBody.replace("{{username}}", genaratedId.maskName(user.getUsername()));
            emailBody = emailBody.replace("{{orderNo}}", order.getOrderInfo());

            StringBuilder orderDetails = new StringBuilder();
            double totalAmount = 0;

            for (OrderDetail od : order.getOrderDetails()) {
                double itemTotal = od.getPrice();
                totalAmount += itemTotal;

                orderDetails.append("<tr>")
                        .append("<td>").append(od.getProduct().getName()).append("</td>")
                        .append("<td>").append(od.getQuantity()).append("</td>")
                        .append("<td>").append(String.format("%,.2f VND", itemTotal)).append("</td>")
                        .append("</tr>");
            }

            emailBody = emailBody.replace("{{orderDetails}}", orderDetails.toString());
            emailBody = emailBody.replace("{{totalAmount}}", String.format("%,.2f VND", totalAmount));

            return emailBody;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
