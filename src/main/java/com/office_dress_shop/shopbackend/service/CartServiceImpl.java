package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Addon;
import com.office_dress_shop.shopbackend.pojo.Cart;
import com.office_dress_shop.shopbackend.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Override
    public Page<Cart> searchByName(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return cartRepository.findAll(PageRequest.of(page, size));
        }
        return cartRepository.findByAccount_EmailContaining(searchTerm, PageRequest.of(page, size));
    }

    @Override
    public List<Cart> findAll() {
        return cartRepository.findAll();
    }

    @Override
    public Optional<Cart> findById(int id) {
        return cartRepository.findById(id);
    }


    @Override
    public Cart save(Cart cart) {
        return cartRepository.save(cart);
    }

    @Override
    public Cart getOrCreateCart(Account account) {
        return cartRepository.findByAccount(account)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setAccount(account);
                    return cartRepository.save(cart);
                });
    }
}
