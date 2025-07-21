package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.CartItem;

import java.util.List;
import java.util.Optional;

public interface CartItemService {
    List<CartItem> findAll();
    List<CartItem> findByCartId(int cartId);
    Optional<CartItem> findById(int id);
    CartItem save(CartItem cartItem);
    void deleteById(int id);
    void deleteByCartId(int cartId);
}