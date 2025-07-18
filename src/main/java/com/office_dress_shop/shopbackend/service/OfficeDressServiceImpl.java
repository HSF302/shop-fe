package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Material;
import com.office_dress_shop.shopbackend.pojo.OfficeDress;
import com.office_dress_shop.shopbackend.repository.OfficeDressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@Service
public class OfficeDressServiceImpl implements OfficeDressService {

    @Autowired
    private OfficeDressRepository officeDressRepository;

    public Page<OfficeDress> searchByName(String searchTerm, int page, int size) {
        if (searchTerm == null || searchTerm.isEmpty()) {
            return officeDressRepository.findAll(PageRequest.of(page, size));
        }
        return officeDressRepository.findByDescriptionContaining(searchTerm, PageRequest.of(page, size));
    }

    @Override
    public List<OfficeDress> findAll() {
        return officeDressRepository.findAll();
    }

    @Override
    public Optional<OfficeDress> findById(int id) {
        return officeDressRepository.findById(id);
    }

    @Override
    public OfficeDress save(OfficeDress officeDress) {
        return officeDressRepository.save(officeDress);
    }

    @Override
    public void deleteById(int id) {
        OfficeDress officeDress = officeDressRepository.findById(id)
                .orElseThrow();
        officeDress.setStatus(false);
    }

    public Boolean uploadOfficeDress(MultipartFile imageFile, int id) throws IOException {
        OfficeDress officeDress = findById(id)
                .orElseThrow();

        if (!imageFile.isEmpty()) {
            String oldImageUrl = officeDress.getImageUrl();
            if (oldImageUrl != null && !oldImageUrl.isBlank()) {
                // Convert URL to path (assumes you're storing in "images/uploads/")
                Path oldImagePath = Paths.get("images/uploads/", Paths.get(oldImageUrl).getFileName().toString());

                // Delete the old image file if it exists
                if (Files.exists(oldImagePath)) {
                    Files.delete(oldImagePath);
                }
            }

            String fileName = imageFile.getOriginalFilename();
            Path path = Paths.get("images/uploads/", fileName);
            Files.write(path, imageFile.getBytes());

            officeDress.setImageUrl("/images/uploads/" + fileName);
        } else {
            officeDress.setImageUrl("/images/uploads/");
        }
        officeDress.setStatus(true);
        save(officeDress);
        return true;
    }
}