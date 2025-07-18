package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Page<Category> findByNameContaining(String name, Pageable pageable);
}
