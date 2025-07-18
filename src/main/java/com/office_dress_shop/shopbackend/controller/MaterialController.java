package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/materials")
public class MaterialController {
    @Autowired private MaterialService service;

    @GetMapping
    public String list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        // Get paginated results (page size 10 by default)
        Page<Material> materialPage = service.searchByName(search, page, 10);

        // Add to model
        model.addAttribute("materials", materialPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", materialPage.getTotalPages());

        return "material/list";
    }

    @GetMapping("/add")
    public String addForm(Model model) {
        model.addAttribute("material", new Material());
        return "material/add";
    }

    @PostMapping("/add")
    public String add(@ModelAttribute Material material) {
        service.save(material);
        return "redirect:/materials";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(m -> { model.addAttribute("material", m); return "material/edit"; })
                .orElse("redirect:/materials");
    }

    @PostMapping("/edit/{id}")
    public String edit(@PathVariable int id, @ModelAttribute Material material) {
        material.setId(id);
        service.save(material);
        return "redirect:/materials";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        service.deleteById(id);
        return "redirect:/materials";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(m -> { model.addAttribute("material", m); return "material/detail"; })
                .orElse("redirect:/materials");
    }
}
