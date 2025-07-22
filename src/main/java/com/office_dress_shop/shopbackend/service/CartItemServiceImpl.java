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
        // Kiểm tra trùng sản phẩm trong cart (cùng product, size, color, material, addons)
        List<CartItem> existingItems = cartItemRepository.findByCartId(cartItem.getCart().getId());
        for (CartItem existing : existingItems) {
            if (existing.getProduct().getId() == cartItem.getProduct().getId()
                && existing.getSize().getId() == cartItem.getSize().getId()
                && existing.getColor().getId() == cartItem.getColor().getId()
                && existing.getMaterial().getId() == cartItem.getMaterial().getId()
                && addonsEquals(existing.getAddons(), cartItem.getAddons())) {
                // Nếu trùng, cộng dồn số lượng
                existing.setQuantity(existing.getQuantity() + cartItem.getQuantity());
                return cartItemRepository.save(existing);
            }
        }
        // Nếu chưa có, tạo mới
        return cartItemRepository.save(cartItem);
    }

    // So sánh 2 list addon theo id
    private boolean addonsEquals(List a, List b) {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        if (a.size() != b.size()) return false;
        return a.stream().map(x -> ((com.office_dress_shop.shopbackend.pojo.Addon)x).getId()).sorted()
                .toList().equals(
                b.stream().map(x -> ((com.office_dress_shop.shopbackend.pojo.Addon)x).getId()).sorted().toList()
        );
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
