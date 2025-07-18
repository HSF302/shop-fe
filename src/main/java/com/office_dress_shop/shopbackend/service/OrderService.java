package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Cart;
import com.office_dress_shop.shopbackend.pojo.Order;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    Order createOrder(Account account, Cart cart);
    Optional<Order> findById(int id);
    Order updateOrderStatus(int id, String status);
    Page<Order> searchOrdersByStatusAndEmail(String status, String email, int page, int size);
    Page<Order> searchOrdersByAccountAndStatus(Account account, String status, int page, int size);
}