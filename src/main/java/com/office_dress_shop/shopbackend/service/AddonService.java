package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.*;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface AddonService {
    List<Addon> findAllById(List<Integer> ids);
    Page<Addon> searchByName(String searchTerm, int page, int size);
    List<Addon> findAll();
    Optional<Addon> findById(int id);
    Addon save(Addon addon);
    void deleteById(int id);
}
