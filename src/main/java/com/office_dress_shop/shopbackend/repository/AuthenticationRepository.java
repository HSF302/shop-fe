package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthenticationRepository extends JpaRepository<Account, String> {
    Account findAccountByEmail(String email);
    Account findByResetToken(String token);
}
