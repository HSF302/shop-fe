package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
}
