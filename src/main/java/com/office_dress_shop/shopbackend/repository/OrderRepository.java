package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    // For admin search with both status and email
    Page<Order> findByOrderStatusAndAccount_EmailContainingIgnoreCase(String status, String email, Pageable pageable);

    // For admin search by email only
    Page<Order> findByAccount_EmailContainingIgnoreCase(String email, Pageable pageable);

    // For admin search by status only
    Page<Order> findByOrderStatus(String status, Pageable pageable);

    // For user viewing their orders filtered by status
    Page<Order> findByAccount(Account account, Pageable pageable);
    Page<Order> findByAccountAndOrderStatus(Account account, String status, Pageable pageable);
}