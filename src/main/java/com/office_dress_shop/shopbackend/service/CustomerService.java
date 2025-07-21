package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;

import java.util.Optional;

public interface CustomerService {
    Optional<Account> findById(int id);
    Optional<Account> findByEmail(String email);
    Account updateProfile(int id, Account updateData);
}
