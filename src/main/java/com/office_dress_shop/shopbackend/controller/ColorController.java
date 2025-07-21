package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/colors")
public class ColorController {
    @Autowired private ColorService service;

    @GetMapping
    public String list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        // Get paginated results (page size 10 by default)
        Page<Color> colorPage = service.searchByName(search, page, 10);

        // Add to model
        model.addAttribute("colors", colorPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", colorPage.getTotalPages());

        return "color/list";
    }

    @GetMapping("/add")
    public String addForm(Model model) {
        model.addAttribute("color", new Color());
        return "color/add";
    }

    @PostMapping("/add")
    public String add(@ModelAttribute Color color) {
        service.save(color);
        return "redirect:/colors";
    }

    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(c -> { model.addAttribute("color", c); return "color/edit"; })
                .orElse("redirect:/colors");
    }

    @PostMapping("/edit/{id}")
    public String edit(@PathVariable int id, @ModelAttribute Color color) {
        color.setId(id);
        service.save(color);
        return "redirect:/colors";
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id) {
        service.deleteById(id);
        return "redirect:/colors";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable int id, Model model) {
        return service.findById(id)
                .map(c -> { model.addAttribute("color", c); return "color/detail"; })
                .orElse("redirect:/colors");
    }
}
