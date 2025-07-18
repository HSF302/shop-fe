package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Cart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Integer> {
    Page<Cart> findByAccount_EmailContaining(String accountEmail, Pageable pageable);

    Cart findByAccountId(int accountId);

    Optional<Cart> findByAccount(Account account);
}
