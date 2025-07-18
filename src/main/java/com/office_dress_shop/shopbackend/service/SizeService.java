package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface SizeService {
    Page<Size> searchByName(String searchTerm, int page, int size);
    List<Size> findAll();
    Optional<Size> findById(int id);
    Size save(Size size);
    void deleteById(int id);
}
