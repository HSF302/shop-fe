package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.OrderDetail;
import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Cart;
import com.office_dress_shop.shopbackend.pojo.Order;
import org.springframework.data.domain.Page;


import java.util.List;

public interface OrderDetailService {
    Order createOrderFromCart(Account account, Cart cart, String shippingAddress);
    OrderDetail save(OrderDetail orderDetail);
    Page<OrderDetail> findByOrderId(int orderId, int page, int size);
    OrderDetail findById(int id);
}
