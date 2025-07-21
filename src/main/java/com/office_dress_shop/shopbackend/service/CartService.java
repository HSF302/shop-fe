package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Addon;
import com.office_dress_shop.shopbackend.pojo.Cart;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CartService {
    Page<Cart> searchByName(String searchTerm, int page, int size);
    List<Cart> findAll();
    Optional<Cart> findById(int id);
    Cart save(Cart cart);
    Cart getOrCreateCart(Account account);
}
