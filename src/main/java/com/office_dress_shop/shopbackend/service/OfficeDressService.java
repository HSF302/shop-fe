package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Color;
import com.office_dress_shop.shopbackend.pojo.OfficeDress;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

public interface OfficeDressService {
    Page<OfficeDress> searchByName(String searchTerm, int page, int size);
    List<OfficeDress> findAll();
    Optional<OfficeDress> findById(int id);
    OfficeDress save(OfficeDress officeDress);
    void deleteById(int id);
    Boolean uploadOfficeDress(MultipartFile imageFile, int id) throws IOException;
}