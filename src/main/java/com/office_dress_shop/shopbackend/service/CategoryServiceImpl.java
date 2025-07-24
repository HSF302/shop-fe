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
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepository repo;
    @Autowired
    private OfficeDressRepository officeDressRepository;

    public Page<Category> searchByName(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return repo.findAll(PageRequest.of(page, size));
        }
        return repo.findByNameContaining(searchTerm, PageRequest.of(page, size));
    }

    public List<Category> findAll() {
        return repo.findAll();
    }

    public Optional<Category> findById(int id) {
        return repo.findById(id);
    }

    public Category save(Category category) {
        return repo.save(category);
    }

    public void deleteById(int id) {
        List<OfficeDress> dresses = officeDressRepository.findAll();
        for (OfficeDress dress : dresses) {
            if (dress.getCategory() != null && dress.getCategory().getId() == id) {
                dress.setCategory(null);
                officeDressRepository.save(dress);
            }
        }
        // Now safe to delete
        repo.deleteById(id);

    }
}
