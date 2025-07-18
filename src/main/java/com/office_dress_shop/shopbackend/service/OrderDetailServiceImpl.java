package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.repository.OrderDetailRepository;
import com.office_dress_shop.shopbackend.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;


import java.time.LocalDate;
import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {
    @Autowired
    private CartItemService cartService;
    @Autowired
    private CartItemService cartItemService;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private OfficeDressService officeDressService;


    @Transactional
    @Override
    public Order createOrderFromCart(Account account, Cart cart, String shippingAddress) {
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        cart.getItems().forEach(cartItem -> {
            OfficeDress officeDress = officeDressService.findById(cartItem.getProduct().getId()).orElse(null);
            officeDress.setQuantity(officeDress.getQuantity() - cartItem.getQuantity());
            if (officeDress.getQuantity() <= 0) {
                throw new IllegalStateException("Cart quantity exceed product quantity");
            }
        });

        // Create and setup new order
        Order order = new Order();
        order.setAccount(account);
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("PENDING");
        order.setShippingAddress(shippingAddress);

        // Calculate total amount
        double totalAmount = cart.getItems().stream()
                .mapToDouble(CartItem::calculateTotalPrice)
                .sum();
        order.setTotalAmount(totalAmount);

        // Save order to get ID
        Order savedOrder = orderRepository.save(order);

        // Create order details from cart items
        cart.getItems().forEach(cartItem -> {
            OrderDetail orderDetail = new OrderDetail(savedOrder, cartItem);
            orderDetailRepository.save(orderDetail);
        });

        // Clear cart
        cartItemService.deleteByCartId(cart.getId());

        return savedOrder;
    }


    @Override
    public OrderDetail save(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public Page<OrderDetail> findByOrderId(int orderId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderDetailRepository.findByOrderId(orderId, pageable);
    }
    @Override
    public OrderDetail findById(int id) {
        return orderDetailRepository.findById(id).orElse(null);
    }

}
