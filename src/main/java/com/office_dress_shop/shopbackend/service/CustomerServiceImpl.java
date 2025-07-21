package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerServiceImpl implements CustomerService {
    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Optional<Account> findById(int id) {
        return customerRepo.findById(id);
    }

    @Override
    public Optional<Account> findByEmail(String email) {
        return customerRepo.findByEmail(email);
    }

    @Override
    public Account updateProfile(int id, Account updateData) {
        return customerRepo.findById(id).map(acc -> {
            acc.setName(updateData.getName());
            acc.setAddress(updateData.getAddress());
            acc.setPhone(updateData.getPhone());
            // Không update email, role, isActived
            if (updateData.getPassword() != null && !updateData.getPassword().isBlank()) {
                acc.setPassword(passwordEncoder.encode(updateData.getPassword()));
            }
            return customerRepo.save(acc);
        }).orElse(null);
    }
}
