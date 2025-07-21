package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.service.AccountService;
import com.office_dress_shop.shopbackend.service.OrderDetailService;
import com.office_dress_shop.shopbackend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.pojo.Order;
import com.office_dress_shop.shopbackend.pojo.OrderDetail;
import com.office_dress_shop.shopbackend.enums.Role;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;

@Controller
@RequestMapping("/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public String listOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String email,
            @RequestParam(defaultValue = "0") int page,
            Model model,
            HttpSession session) {

        // Add search terms to model
        model.addAttribute("statusTerm", status);
        model.addAttribute("emailTerm", email);

        Account account = (Account) session.getAttribute("account");
        Page<Order> orderPage;

        if (account.getRole() == Role.ADMIN) {
            orderPage = orderService.searchOrdersByStatusAndEmail(status, email, page, 10);
        } else {
            orderPage = orderService.searchOrdersByAccountAndStatus(account, status, page, 10);
        }

        // Add pagination attributes
        model.addAttribute("orders", orderPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", orderPage.getTotalPages());
        model.addAttribute("account", account);

        return "order/list";
    }

    @GetMapping("/details/{orderId}")
    public String viewOrderDetails(@PathVariable int orderId,
                                   @RequestParam(defaultValue = "0") int page,
                                   HttpSession session,
                                   Model model) {
        Account account = (Account) session.getAttribute("account");
        Order order = orderService.findById(orderId).orElse(null);

        // Check if current user is either admin or the order owner
        boolean isAdmin = account.getRole().equals(Role.ADMIN); // or check account.getRole() == Role.ADMIN
        boolean isOwner = order.getAccount().getId() == account.getId();

        if (!isAdmin && !isOwner) {
            return "redirect:/error";
        }

        Page<OrderDetail> orderDetails = orderDetailService.findByOrderId(orderId, page, 10);
        model.addAttribute("account", account);
        model.addAttribute("order", order); // Add order to model
        model.addAttribute("orderDetails", orderDetails.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", orderDetails.getTotalPages());
        return "order/details";
    }

    @PostMapping("/details/{orderId}")
    public String updateOrderStatus(@PathVariable int orderId,
                                    @RequestParam String status,
                                    HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        Order order = orderService.findById(orderId).orElse(null);

        // Check if current user is either admin or the order owner
        boolean isAdmin = account.getRole().equals(Role.ADMIN); // or check account.getRole() == Role.ADMIN
        boolean isOwner = order.getAccount().getId() == account.getId();

        if (!isAdmin && !isOwner) {
            return "redirect:/error";
        }

        orderService.updateOrderStatus(orderId, status);
        return "redirect:/orders/details/" + orderId;
    }

    @GetMapping("/details/product/{orderDetailId}")
    public String viewOrderItemDetail(@PathVariable int orderDetailId, Model model, HttpSession session) {
        Account account = (Account) session.getAttribute("account");
        OrderDetail orderDetail = orderDetailService.findById(orderDetailId);
        Order order = orderService.findById(orderDetail.getOrder().getId()).orElse(null);
        // Check if current user is either admin or the order owner
        boolean isAdmin = account.getRole().equals(Role.ADMIN); // or check account.getRole() == Role.ADMIN
        boolean isOwner = order.getAccount().getId() == account.getId();

        if (!isAdmin && !isOwner) {
            return "redirect:/error";
        }

        model.addAttribute("orderDetail", orderDetail);
        double totalPrice = orderDetail.getTotalAmount();
        model.addAttribute("totalPrice", totalPrice);

        return "order/singledetails";
    }


}
