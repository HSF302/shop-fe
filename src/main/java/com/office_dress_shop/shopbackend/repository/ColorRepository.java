package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ColorRepository extends JpaRepository<Color, Integer> {
    Page<Color> findByNameContaining(String name, Pageable pageable);

}
