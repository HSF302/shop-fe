package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/sizes")
public class SizeController {
    @Autowired private SizeService service;

    @GetMapping
    public String list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        // Get paginated results (page size 10 by default)
        Page<Size> sizePage = service.searchByName(search, page, 10);

        // Add to model
        model.addAttribute("sizes", sizePage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", sizePage.getTotalPages());

        return "size/list";
    }

    @GetMapping("/add")
    public String addForm(Model model) {
        model.addAttribute("size", new Size());
        return "size/add";
    }

    @PostMapping("/add")
    public String add(@ModelAttribute Size size) {
        service.save(size);
        return "redirect:/sizes";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(s -> { model.addAttribute("size", s); return "size/edit"; })
                .orElse("redirect:/sizes");
    }

    @PostMapping("/edit/{id}")
    public String edit(@PathVariable int id, @ModelAttribute Size size) {
        size.setId(id);
        service.save(size);
        return "redirect:/sizes";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        service.deleteById(id);
        return "redirect:/sizes";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(s -> { model.addAttribute("size", s); return "size/detail"; })
                .orElse("redirect:/sizes");
    }
}
