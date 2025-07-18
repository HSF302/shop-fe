package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    List<CartItem> findByCartId(int cartId);
}