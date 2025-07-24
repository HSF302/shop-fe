package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.Color;
import com.office_dress_shop.shopbackend.pojo.OfficeDress;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OfficeDressRepository extends JpaRepository<OfficeDress, Integer> {


    Page<OfficeDress> findByDescriptionContaining(String description, Pageable pageable);
    List<OfficeDress> findAllByAddons_Id(int addonId);

}