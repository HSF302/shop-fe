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
        System.out.println("DEBUG /carts - role: " + (acc != null ? acc.getRole() : "null"));

        model.addAttribute("searchTerm", search);

        if (acc != null && acc.getRole() == Role.ADMIN) {
            Page<Cart> cartPage = cartService.searchByName(search, page, 10);

            model.addAttribute("carts", cartPage.getContent());
            model.addAttribute("currentPage", page);
            model.addAttribute("totalPages", cartPage.getTotalPages());
            System.out.println("DEBUG /carts - return view: cart/list (admin)");
            return "cart/list";
        } else if (acc != null && acc.getRole() == Role.CUSTOMER) {
            Cart cart = cartService.getOrCreateCart(acc);
            model.addAttribute("selectedCart", cart);
            var cartItems = cart.getItems();
            model.addAttribute("cartItems", cartItems);
            double cartTotal = cartItems.stream().mapToDouble(item -> item.calculateTotalPrice()).sum();
            model.addAttribute("cartTotal", cartTotal);
            model.addAttribute("account", acc);
            model.addAttribute("role", acc.getRole().name());
            System.out.println("DEBUG /carts - return view: cartitem/list (customer)");
            return "cartitem/list";
        } else {
            System.out.println("DEBUG /carts - unknown role, redirect home");
            return "redirect:/";
        }
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
