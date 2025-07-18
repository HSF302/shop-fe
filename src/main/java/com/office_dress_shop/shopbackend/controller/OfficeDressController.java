package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.OfficeDress;
import com.office_dress_shop.shopbackend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/officedresses")
public class OfficeDressController {

    @Autowired
    private OfficeDressService officeDressService;
    @Autowired
    private SizeService sizeService;
    @Autowired
    private ColorService colorService;
    @Autowired
    private MaterialService materialService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private AddonService addonService;

    @GetMapping
    public String list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        // Get paginated results (page size 10 by default)
        Page<OfficeDress> officeDressPage = officeDressService.searchByName(search, page, 10);

        // Add to model
        model.addAttribute("dresses", officeDressPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", officeDressPage.getTotalPages());

        return "officedress/list";
    }

    @GetMapping("/add")
    public String showAddForm(Model model) {
        model.addAttribute("officeDress", new OfficeDress());
        model.addAttribute("sizes", sizeService.findAll());
        model.addAttribute("colors", colorService.findAll());
        model.addAttribute("materials", materialService.findAll());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("addons", addonService.findAll());
        return "officedress/add";
    }

    @PostMapping("/add")
    public String addOfficeDress(@ModelAttribute OfficeDress officeDress) throws IOException {

        officeDress.setStatus(false);
        officeDressService.save(officeDress);
        int id = officeDress.getId();
        return "redirect:/officedresses/upload/" + officeDress.getId();
    }

    @GetMapping("/upload/{id}")
    public String showUploadForm(@PathVariable int id, Model model) {
        OfficeDress officeDress = officeDressService.findById(id)
                .orElseThrow();

        model.addAttribute("officeDress", officeDress); // Add the actual object, not Optional
        model.addAttribute("dressId", id);
        return "officedress/upload";
    }

    @PostMapping("/upload/{id}")
    public String uploadImage(
        @PathVariable int id,
        @RequestParam("imageFile") MultipartFile imageFile,
        Model model
    ) throws IOException {
        Boolean result = officeDressService.uploadOfficeDress(imageFile, id);
        if (!result) {
            model.addAttribute("message", "you have not uploaded your image or wrong id");
            return "officedress/upload";
        }
        return "redirect:/officedresses";
    }

    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable int id, Model model) {
        return officeDressService.findById(id)
                .map(dress -> {
                    model.addAttribute("officeDress", dress);
                    model.addAttribute("sizes", sizeService.findAll());
                    model.addAttribute("colors", colorService.findAll());
                    model.addAttribute("materials", materialService.findAll());
                    model.addAttribute("categories", categoryService.findAll());
                    model.addAttribute("addons", addonService.findAll());
                    return "officedress/edit";
                })
                .orElse("redirect:/officedresses");
    }

    @PostMapping("/edit/{id}")
    public String updateOfficeDress(@PathVariable int id,
                                    @ModelAttribute OfficeDress officeDress,
                                    @RequestParam(value = "imageFile", required = false) MultipartFile imageFile) throws IOException {
        officeDress.setId(id);

        if (imageFile != null && !imageFile.isEmpty()) {
            String uploadDir = new ClassPathResource("static/images/uploads/").getFile().getAbsolutePath();
            String fileName = imageFile.getOriginalFilename();
            Path path = Paths.get(uploadDir, fileName);
            Files.write(path, imageFile.getBytes());

            officeDress.setImageUrl("/images/uploads/" + fileName);
        }

        officeDressService.save(officeDress);
        return "redirect:/officedresses";
    }

    @GetMapping("/delete/{id}")
    public String deleteOfficeDress(@PathVariable int id) {
        officeDressService.deleteById(id);
        return "redirect:/officedresses";
    }

    @GetMapping("/{id}")
    public String viewDetails(@PathVariable int id, Model model) {
        return officeDressService.findById(id)
                .map(dress -> {
                    model.addAttribute("officeDress", dress);
                    return "officedress/detail";
                })
                .orElse("redirect:/officedresses");
    }
}
