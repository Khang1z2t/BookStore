package com.fis.backend.delegates.order_processing;

import com.fis.backend.entity.Order;
import com.fis.backend.entity.OrderDetail;
import com.fis.backend.entity.User;
import com.fis.backend.repository.OrderRepository;
import com.fis.backend.repository.UserRepository;
import com.fis.backend.services.MailService;
import com.fis.backend.utils.GenaratedId;
import com.fis.backend.utils.enums.OrderStatus;
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
    private final UserRepository userRepository;
    private final MailService mailService;

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        String businessKey = delegateExecution.getProcessBusinessKey();

        Order order = orderRepository.findByBusinessKey(businessKey)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        User user = userRepository.findById(order.getUser().getId())
                .orElseThrow(() -> new NotFoundException("User not found"));

        order.setStatus(OrderStatus.CONFIRMED.toString());
        orderRepository.save(order);
        String emailBody = loadEmailTemplate(order, user);
        try {
            // send email
            mailService.sendEmail(user.getEmail(), "Thông báo đơn hàng: " + order.getOrderInfo(), emailBody);
            log.info("Sending email to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email", e);
        }
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
