package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.OfficeDress;
import com.office_dress_shop.shopbackend.service.OfficeDressService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class HomeController {
    @Autowired
    private OfficeDressService officeDressService;

    @GetMapping()
    public String homePage(
            HttpSession session,
            Model model,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        // Handle account info
        Account account = (Account) session.getAttribute("account");
        if (account != null) {
            model.addAttribute("email", account.getEmail());
            model.addAttribute("role", account.getRole());
        }

        // Add search term to model
        model.addAttribute("searchTerm", search);

        // Get paginated products with search
        Page<OfficeDress> officeDressPage = officeDressService.searchByName(search, page, size);

        // Add pagination data to model
        model.addAttribute("dresses", officeDressPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", officeDressPage.getTotalPages());
        model.addAttribute("totalItems", officeDressPage.getTotalElements());

        return "home";
    }
}

