package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface AccountService {
    Page<Account> searchByNameOrEmail(String searchTerm, int page, int size);
    List<Account> findAll();
    Optional<Account> findById(int id);
    Account save(Account account);
    void deleteById(int id);
    boolean createAccountByAdmin(Account account);
}
