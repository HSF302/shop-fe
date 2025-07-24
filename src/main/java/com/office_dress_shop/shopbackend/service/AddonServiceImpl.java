package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AddonServiceImpl implements AddonService {
    @Autowired
    private OfficeDressRepository officeDressRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private AddonRepository repo;

    public Page<Addon> searchByName(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return repo.findAll(PageRequest.of(page, size));
        }
        return repo.findByNameContaining(searchTerm, PageRequest.of(page, size));
    }

    @Override
    public List<Addon> findAllById(List<Integer> ids) {
        return repo.findAllById(ids);
    }

    public List<Addon> findAll() {
        return repo.findAll();
    }

    public Optional<Addon> findById(int id) {
        return repo.findById(id);
    }

    public Addon save(Addon addon) {
        return repo.save(addon);
    }

    public void deleteById(int id) {

        Addon addon = repo.findById(id).orElseThrow();
        // Remove from OfficeDress
        List<OfficeDress> dresses = officeDressRepository.findAllByAddons_Id(id);
        for (OfficeDress dress : dresses) {
            dress.getAddons().remove(addon);
            officeDressRepository.save(dress);
        }
        // Remove from CartItem
        List<CartItem> cartItems = cartItemRepository.findAllByAddons_Id(id);
        for (CartItem item : cartItems) {
            item.getAddons().remove(addon);
            cartItemRepository.save(item);
        }
        // Now safe to delete
        repo.deleteById(id);
    }
}
