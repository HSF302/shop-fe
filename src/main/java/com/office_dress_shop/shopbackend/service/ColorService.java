package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface ColorService {
    Page<Color> searchByName(String searchTerm, int page, int size);
    List<Color> findAll();
    Optional<Color> findById(int id);
    Color save(Color color);
    void deleteById(int id);
}
