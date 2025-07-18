package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Cart;
import com.office_dress_shop.shopbackend.pojo.CartItem;
import com.office_dress_shop.shopbackend.repository.CartItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartItemServiceImpl implements CartItemService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Override
    public List<CartItem> findAll() {
        return cartItemRepository.findAll();
    }

    @Override
    public List<CartItem> findByCartId(int cartId) {
        return cartItemRepository.findByCartId(cartId);
    }

    @Override
    public Optional<CartItem> findById(int id) {
        return cartItemRepository.findById(id);
    }

    @Override
    public CartItem save(CartItem cartItem) {
        return cartItemRepository.save(cartItem);
    }

    @Override
    @Transactional
    public void deleteById(int id) {
        cartItemRepository.findById(id).ifPresent(item -> {
            item.getAddons().clear();

            Cart cart = item.getCart();
            if (cart != null) {
                cart.getItems().remove(item);
            }

            cartItemRepository.delete(item);
        });
    }

    @Override
    @Transactional
    public void deleteByCartId(int cartId) {
        List<CartItem> cartItems = cartItemRepository.findByCartId(cartId);
        for (CartItem item : cartItems) {
            item.getAddons().clear();
            Cart cart = item.getCart();
            if (cart != null) {
                cart.getItems().remove(item);
            }
            cartItemRepository.delete(item);
        }
    }

}
