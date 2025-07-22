package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.service.AccountService;
import com.office_dress_shop.shopbackend.service.OrderService;
import com.office_dress_shop.shopbackend.service.OfficeDressService;
import com.office_dress_shop.shopbackend.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired private AccountService accountService;
    @Autowired private OrderService orderService;
    @Autowired private OfficeDressService officeDressService;
    @Autowired private CategoryService categoryService;

    @GetMapping("")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/accounts")
    public String manageAccounts(@RequestParam(required = false) String search,
                                 @RequestParam(defaultValue = "0") int page,
                                 Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> accountPage = accountService.searchByNameOrEmail(search, page, 10);
        model.addAttribute("accounts", accountPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", accountPage.getTotalPages());
        return "admin/account-list";
    }

    @GetMapping("/orders")
    public String manageOrders(@RequestParam(required = false) String status,
                               @RequestParam(required = false) String email,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        model.addAttribute("statusTerm", status);
        model.addAttribute("emailTerm", email);
        Page<?> orderPage = orderService.searchOrdersByStatusAndEmail(status, email, page, 10);
        model.addAttribute("orders", orderPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", orderPage.getTotalPages());
        return "admin/order-list";
    }

    @GetMapping("/officedresses")
    public String manageDresses(@RequestParam(required = false) String search,
                                @RequestParam(defaultValue = "0") int page,
                                Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> dressPage = officeDressService.searchByName(search, page, 10);
        model.addAttribute("dresses", dressPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", dressPage.getTotalPages());
        return "admin/dress-list";
    }

    @GetMapping("/categories")
    public String manageCategories(@RequestParam(required = false) String search,
                                   @RequestParam(defaultValue = "0") int page,
                                   Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> categoryPage = categoryService.searchByName(search, page, 10);
        model.addAttribute("categories", categoryPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", categoryPage.getTotalPages());
        return "admin/category-list";
    }
} 