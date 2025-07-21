package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.service.AuthenticationService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @GetMapping("/register")
    public String registerPage(Model model) {
        model.addAttribute("account", new Account());
        return "authentication/register";
    }

    @PostMapping("/register")
    public String register(@ModelAttribute("account") Account account,
                           Model model) {
        if (authenticationService.emailExists(account.getEmail())) {
            model.addAttribute("error", "Email đã tồn tại!");
            return "authentication/register";
        }
        boolean success = authenticationService.register(account);
        if (success) {
            model.addAttribute("message", "Đăng ký thành công! Vui lòng đăng nhập.");
            return "authentication/login";
        } else {
            model.addAttribute("error", "Đăng ký thất bại! Vui lòng thử lại.");
            return "authentication/register";
        }
    }

    @GetMapping("/login")
    public String loginPage() {
        return "authentication/login";
    }

    @PostMapping("/login")
    public String login(@RequestParam String email,
                        @RequestParam String password,
                        HttpServletResponse response,
                        HttpSession session,
                        Model model) {
        Account account = authenticationService.authenticate(email, password);

        if (account != null) {
            session.setAttribute("account", account);

//            session.setAttribute("loggedInUserId", account.getId());

            System.out.println("Account found in session: " + account.getEmail());

            return "redirect:/";
        }

        // Move session check after successful authentication
        Account sessionAccount = (Account) session.getAttribute("account");
        if (sessionAccount == null) {
            System.out.println("No account found in session.");
        } else {
            System.out.println("Account found in session: " + sessionAccount.getEmail());
        }

        model.addAttribute("error", "Sai tài khoản hoặc mật khẩu!");
        return "authentication/login";
    }


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }

    @GetMapping("/forgot-password")
    public String forgotPasswordPage() {
        return "authentication/forgot-password";
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email, Model model) {
        boolean result = authenticationService.forgotPassword(email);
        if (result) {
            model.addAttribute("message", "Vui lòng kiểm tra email để đặt lại mật khẩu!");
        } else {
            model.addAttribute("error", "Không tìm thấy tài khoản!");
        }
        return "authentication/forgot-password";
    }

    @GetMapping("/reset-password")
    public String resetPasswordPage(@RequestParam String token, Model model) {
        model.addAttribute("token", token);
        return "authentication/reset-password";
    }

    @PostMapping("/reset-password")
    public String resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword,
            Model model) {
        boolean result = authenticationService.resetPassword(token, newPassword);
        if (result) {
            model.addAttribute("message", "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            return "authentication/login";
        } else {
            model.addAttribute("error", "Token không hợp lệ hoặc đã hết hạn!");
            model.addAttribute("token", token);
            return "authentication/reset-password";
        }
    }
}

