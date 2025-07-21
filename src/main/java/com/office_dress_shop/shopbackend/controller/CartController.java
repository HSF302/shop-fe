package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.enums.Role;
import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Cart;
import com.office_dress_shop.shopbackend.service.CartService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/carts")
public class CartController {

    @Autowired
    private CartService cartService;

    @ModelAttribute
    public void addRoleToModel(HttpSession session, Model model) {
        Account acc = (Account) session.getAttribute("account");
        if (acc != null) {
            model.addAttribute("role", acc.getRole().name());
        }
    }

    @GetMapping
    public String list(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            HttpSession session) {

        Account acc = (Account) session.getAttribute("account");

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        if (acc.getRole() == Role.ADMIN) {
            // Get paginated results for admin (page size 10 by default)
            Page<Cart> cartPage = cartService.searchByName(search, page, 10);

            // Add to model
            model.addAttribute("carts", cartPage.getContent());
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", cartPage.getTotalPages());
        } else {
            // For regular users, just get their single cart (no pagination needed)
            Cart cart = cartService.getOrCreateCart(acc);
            model.addAttribute("carts", java.util.List.of(cart));

            // Set pagination attributes for consistency in template
            model.addAttribute("currentPage", 0);
            model.addAttribute("totalPages", 1);
        }

        return "cart/list";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable int id, Model model, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");

        return cartService.findById(id)
                .filter(cart -> acc.getRole() == Role.ADMIN || cart.getAccount().getId() == acc.getId())
                .map(cart -> {
                    model.addAttribute("cart", cart);
                    return "cart/detail";
                })
                .orElse("redirect:/carts");
    }

}
