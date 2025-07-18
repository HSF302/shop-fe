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
    private AddonRepository repo;

    public Page<Addon> searchByName(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return repo.findAll(PageRequest.of(page, size));
        }
        return repo.findByNameContaining(searchTerm, PageRequest.of(page, size));
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
        repo.deleteById(id);
    }
}
