package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.repository.OfficeDressRepository;
import com.office_dress_shop.shopbackend.repository.OrderRepository;
import com.office_dress_shop.shopbackend.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private OfficeDressRepository officeDressRepository;

    @Override
    @Transactional
    public Order createOrder(Account account, Cart cart) {
        // First validate all items have sufficient quantity
        validateCartQuantities(cart);

        // Then create the order
        Order order = new Order();
        order.setAccount(account);
        order.setOrderDate(LocalDate.now());
        order.setOrderStatus("PENDING");

        // Calculate total from cart items
        List<CartItem> cartItems = cart.getItems();
        double total = cartItems.stream()
                .mapToDouble(CartItem::calculateTotalPrice)
                .sum();
        order.setTotalAmount(total);

        Order savedOrder = orderRepository.save(order);

        // Create order details and reduce quantities
        for (CartItem cartItem : cartItems) {
            OrderDetail detail = new OrderDetail(savedOrder, cartItem);
            orderDetailRepository.save(detail);

            // Reduce the dress quantity
            OfficeDress dress = cartItem.getProduct();
            dress.setQuantity(dress.getQuantity() - cartItem.getQuantity());
            officeDressRepository.save(dress);
        }

        return savedOrder;
    }

    private void validateCartQuantities(Cart cart) {
        for (CartItem cartItem : cart.getItems()) {
            OfficeDress dress = cartItem.getProduct();
            if (dress.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException(
                        "Not enough inventory for dress: " + dress.getDescription() +
                                ". Available: " + dress.getQuantity() +
                                ", Requested: " + cartItem.getQuantity());
            }
        }
    }

    @Override
    public Optional<Order> findById(int id) {
        return orderRepository.findById(id);
    }

    @Override
    public Order updateOrderStatus(int id, String status) {
        return orderRepository.findById(id)
                .map(order -> {
                    // If changing to CANCELLED status, restore dress quantities
                    if ("CANCELLED".equals(status) && !"CANCELLED".equals(order.getOrderStatus())) {
                        restoreDressQuantities(order);
                    }
                    // If changing from CANCELLED to another status, reduce quantities again
                    else if ("CANCELLED".equals(order.getOrderStatus()) && !"CANCELLED".equals(status)) {
                        reduceDressQuantities(order);
                    }

                    order.setOrderStatus(status);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    private void restoreDressQuantities(Order order) {
        for (OrderDetail detail : order.getOrderDetails()) {
            OfficeDress dress = detail.getProduct();
            int restoredQuantity = detail.getQuantity();
            dress.setQuantity(dress.getQuantity() + restoredQuantity);
            officeDressRepository.save(dress);
        }
    }

    private void reduceDressQuantities(Order order) {
        for (OrderDetail detail : order.getOrderDetails()) {
            OfficeDress dress = detail.getProduct();
            int orderedQuantity = detail.getQuantity();

            if (dress.getQuantity() < orderedQuantity) {
                throw new IllegalStateException(
                        "Not enough inventory for dress ID " + dress.getId() +
                                ". Available: " + dress.getQuantity() +
                                ", Required: " + orderedQuantity);
            }

            dress.setQuantity(dress.getQuantity() - orderedQuantity);
            officeDressRepository.save(dress);
        }
    }

    @Override
    public Page<Order> searchOrdersByStatusAndEmail(String status, String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        if (status != null && !status.isEmpty() && email != null && !email.isEmpty()) {
            return orderRepository.findByOrderStatusAndAccount_EmailContainingIgnoreCase(status, email, pageable);
        } else if (status != null && !status.isEmpty()) {
            return orderRepository.findByOrderStatus(status, pageable);
        } else if (email != null && !email.isEmpty()) {
            return orderRepository.findByAccount_EmailContainingIgnoreCase(email, pageable);
        }
        return orderRepository.findAll(pageable);
    }

    @Override
    public Page<Order> searchOrdersByAccountAndStatus(Account account, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (status != null && !status.isEmpty()) {
            return orderRepository.findByAccountAndOrderStatus(account, status, pageable);
        }
        return orderRepository.findByAccount(account, pageable);
    }
}