package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;

public interface AuthenticationService {
    Account authenticate(String email, String password);
    boolean forgotPassword(String email);
    boolean resetPassword(String token, String newPassword);
    boolean register(Account account);
    boolean emailExists(String email);
}


