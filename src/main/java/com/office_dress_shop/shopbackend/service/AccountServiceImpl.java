package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountServiceImpl implements AccountService{
    @Autowired
    private AccountRepository repo;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Page<Account> searchByNameOrEmail(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return repo.findAll(PageRequest.of(page, size));
        }
        return repo.findByNameContainingOrEmailContaining(
                searchTerm, searchTerm, PageRequest.of(page, size)
        );
    }

    @Override
    public List<Account> findAll() {
        return repo.findAll();
    }

    @Override
    public Optional<Account> findById(int id) {
        return repo.findById(id);
    }

    @Override
    public Account save(Account account) {
        return repo.save(account);
    }

    @Override
    public void deleteById(int id) {
        Optional<Account> accountOptional = repo.findById(id);
        accountOptional.ifPresent(account -> {
            account.setActived(false);
            repo.save(account);
        });
    }
    @Override
    public boolean createAccountByAdmin(Account account) {
        if (repo.findByEmail((account.getEmail().isBlank()) ? account.getEmail() : account.getEmail()).isPresent()) {
            return false;
        }
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        account.setActived(true);
        repo.save(account);
        return true;
    }
}
