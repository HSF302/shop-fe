package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    Page<Category> searchByName(String searchTerm, int page, int size);
    List<Category> findAll();
    Optional<Category> findById(int id);
    Category save(Category category);
    void deleteById(int id);
}
