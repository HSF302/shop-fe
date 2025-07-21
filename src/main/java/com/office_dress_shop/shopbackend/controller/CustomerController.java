package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.enums.Role;
import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.service.AccountService;
import com.office_dress_shop.shopbackend.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/profile")
public class CustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private AccountService accountService;

    // Xem profile
    @GetMapping
    public String viewProfile(Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        Account customerAccount = customerService.findById(account.getId())
                .orElseThrow();
        if (account.getRole() == Role.ADMIN) {
            model.addAttribute("isAdminView", true);
        }
        model.addAttribute("isAdminView", false);
        model.addAttribute("account", account);
        return "customer/profile";
    }

    @GetMapping("/{id}")
    public String viewProfileById(@PathVariable Integer id, Model model, HttpSession session) {
        Account adminAccount = (Account) session.getAttribute("account");
        if (adminAccount == null || adminAccount.getRole() != Role.ADMIN) {
            return "redirect:/auth/login";
        }

        Account customerAccount = customerService.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        model.addAttribute("account", customerAccount);
        model.addAttribute("isAdminView", true);
        return "customer/profile";
    }

    @GetMapping("/edit")
    public String editProfilePage(Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        Account customerAccount = customerService.findById(account.getId())
                .orElseThrow();
        model.addAttribute("account", customerAccount);
        return "customer/edit_profile";
    }

    @PostMapping("/edit")
    public String updateProfile(@ModelAttribute Account account,
                              Model model,
                              HttpSession session) {
        Account currentAccount = (Account) session.getAttribute("account");
        Account updated = customerService.updateProfile(currentAccount.getId(), account);
        session.setAttribute("account", updated);
        if (updated != null) {
            model.addAttribute("message", "Cập nhật thông tin thành công!");
        } else {
            model.addAttribute("error", "Không tìm thấy tài khoản!");
        }
        return "redirect:/profile";
    }
}
