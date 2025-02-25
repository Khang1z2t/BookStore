package com.fis.backend.services.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fis.backend.dto.ApiResponse;
import com.fis.backend.dto.request.CreateOrderRequest;
import com.fis.backend.dto.request.OrderDetailRequest;
import com.fis.backend.dto.request.UpdateOrderRequest;
import com.fis.backend.dto.response.OrderDetailResponse;
import com.fis.backend.dto.response.OrderResponse;
import com.fis.backend.entity.Order;
import com.fis.backend.entity.OrderDetail;
import com.fis.backend.entity.Product;
import com.fis.backend.exception.AppException;
import com.fis.backend.exception.ErrorCode;
import com.fis.backend.mapper.OrderDetailMapper;
import com.fis.backend.mapper.OrderMapper;
import com.fis.backend.repository.OrderDetailRepository;
import com.fis.backend.repository.OrderRepository;
import com.fis.backend.repository.ProductRepository;
import com.fis.backend.services.OrderService;
import com.fis.backend.services.UserService;
import com.fis.backend.utils.Constants;
import com.fis.backend.utils.GenaratedId;
import com.fis.backend.utils.enums.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.TaskService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.task.Task;
import org.springframework.cloud.logging.LoggingRebinder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

import static org.camunda.bpm.admin.impl.plugin.resources.MetricsRestService.objectMapper;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {
    private final TaskService taskService;
    private final RuntimeService runtimeService;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;
    private final OrderMapper orderMapper;
    private final GenaratedId genaratedId;
    private final LoggingRebinder loggingRebinder;

    private String generatorOrderNO(String lastOrderId) {
        String datePart = new SimpleDateFormat("ddMMyy").format(new Date());
        if (lastOrderId == null) {
            return genaratedId.createNewID("OD" + datePart);
        } else {
            return genaratedId.createIDFromLastID("OD" + datePart, 10, lastOrderId);
        }
    }

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {
        ProcessInstance processInstance = runtimeService
                .startProcessInstanceByKey(Constants.START_PROCESS, UUID.randomUUID().toString());
        Order lastOrderNo = orderRepository.findFirstByOrderByOrderInfoDesc();

        double totalPrice = 0;
        double totalProduct = 0;
        boolean orderIsValid = true;
        List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();

        Order order = new Order();
        order.setStatus(OrderStatus.PENDING.toString());
        orderRepository.save(order);

        for (OrderDetailRequest detailRequest : request.getOrderDetails()) {
            Product product = productRepository.findById(detailRequest.getProductId()).orElse(null);
            if (product == null) {
                continue;
            }

            if (detailRequest.getQuantity() > product.getQuantity()) {
                orderIsValid = false;
            }

            OrderDetail orderDetail = new OrderDetail();
            double itemPrice = product.getPrice() * detailRequest.getQuantity();
            orderDetail.setPrice(itemPrice);
            orderDetail.setProduct(product);
            orderDetail.setQuantity(detailRequest.getQuantity());
            orderDetail.setOrder(order);
            orderDetailRepository.save(orderDetail);

            totalPrice += itemPrice;
            totalProduct += detailRequest.getQuantity();

            orderDetailResponses.add(orderDetailMapper.toOrderDetailResponse(orderDetail));
        }

        order.setTotalPrice(totalPrice);
        order.setTotalProduct(totalProduct);
        order.setBusinessKey(processInstance.getBusinessKey());
        order.setOrderInfo(generatorOrderNO(lastOrderNo.getOrderInfo()));
        orderRepository.save(order);

        OrderResponse orderResponse = new OrderResponse();
        orderResponse.setId(order.getId());
        orderResponse.setTotalPrice(totalPrice);
        orderResponse.setTotalItem(totalProduct);
        orderResponse.setOrderInfo(order.getOrderInfo());
        orderResponse.setStatus(order.getStatus());
        orderResponse.setOrderDetails(orderDetailResponses);


        String businessKey = processInstance.getBusinessKey();
        Task task = taskService.createTaskQuery()
                .processInstanceBusinessKey(businessKey)
                .taskDefinitionKey(Constants.START_ORDER)
                .singleResult();

        if (task != null) {
            Map<String, Object> variables = new HashMap<>();
            try {
                String jsonResponse = objectMapper.writeValueAsString(orderResponse);
                variables.put("orderResponse", jsonResponse);
                variables.put("orderIsValid", orderIsValid);

                taskService.complete(task.getId(), variables);
            } catch (Exception e) {
                log.error("Error processing order task: ", e);
            }
        } else {
            log.warn("Do not find task với businessKey: {}", businessKey);
        }

        return orderResponse;
    }

    @Override
    public OrderResponse updateOrder(String id, UpdateOrderRequest request) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));

        double totalPrice = 0;
        double totalProduct = 0;
        boolean orderIsValid = true;
        boolean hasUpdated = false;
        List<OrderDetailResponse> orderDetailResponses = new ArrayList<>();

        for (OrderDetailRequest orderDetailRequest : request.getOrderDetails()) {
            Product product = productRepository.findById(orderDetailRequest.getProductId())
                    .orElse(null);

            if (product == null) {
                orderIsValid = false;
            }

            if (orderDetailRequest.getQuantity() > product.getQuantity()) {
                orderIsValid = false;
            }

            OrderDetail orderDetail = orderDetailRepository
                    .findByOrderAndProductId(order, orderDetailRequest.getProductId())
                    .orElse(null);

            if (orderDetail == null) {
                orderDetail = new OrderDetail();
                orderDetail.setOrder(order);
                orderDetail.setProduct(product);
            }

            if (orderDetailRequest.getQuantity() > product.getQuantity()) {
                orderIsValid = false;
            }

            if (!Objects.equals(orderDetail.getQuantity(), orderDetailRequest.getQuantity())) {
                hasUpdated = true;
            }

            double price = product.getPrice() * orderDetailRequest.getQuantity();
            orderDetail.setPrice(price);
            orderDetail.setQuantity(orderDetailRequest.getQuantity());
            orderDetailRepository.save(orderDetail);

            totalPrice += price;
            totalProduct += orderDetailRequest.getQuantity();

            orderDetailResponses.add(orderDetailMapper.toOrderDetailResponse(orderDetail));
        }

        if (hasUpdated) {
            order.setTotalProduct(totalProduct);
            order.setTotalPrice(totalPrice);
            order.setOrderDetails(orderDetailMapper.toOrderDetailList(orderDetailResponses));
            orderRepository.save(order);
        }

        if (hasUpdated) {
            String businessKey = order.getBusinessKey();
            Task task = taskService.createTaskQuery()
                    .processInstanceBusinessKey(businessKey)
                    .taskDefinitionKey(Constants.UPDATE_ORDER)
                    .singleResult();

            if (task != null) {
                Map<String, Object> variables = new HashMap<>();
                try {
                    String jsonResponse = objectMapper.writeValueAsString(businessKey);
                    variables.put("orderResponse", jsonResponse);
                    variables.put("customerHasCorrected", hasUpdated);
                    variables.put("orderIsValid", orderIsValid);
                    taskService.complete(task.getId(), variables);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        return orderMapper.toOrderResponse(order);
    }

    @Override
    public OrderResponse receiveOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_KEY));
        order.setStatus(OrderStatus.ACTIVE.toString());
        orderRepository.save(order);

        String businessKey = order.getBusinessKey();
        Task task = taskService.createTaskQuery()
                .processInstanceBusinessKey(businessKey)
                .taskDefinitionKey(Constants.RECEIVE_ORDER)
                .singleResult();
        if (task != null) {
            Map<String, Object> variables = new HashMap<>();
            try {
                variables.put("orderId", order.getId());
                taskService.complete(task.getId(), variables);
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return orderMapper.toOrderResponse(order);
    }
}
