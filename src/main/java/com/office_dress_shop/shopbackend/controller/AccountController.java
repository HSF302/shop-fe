package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.enums.Role;
import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.service.AccountService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/list")
    public String listAccounts(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            Model model) {

        // Add search term to model for thymeleaf
        model.addAttribute("searchTerm", search);

        // Get paginated results (page size 10 by default)
        Page<Account> accountPage = accountService.searchByNameOrEmail(search, page, 10);

        // Add to model
        model.addAttribute("accounts", accountPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", accountPage.getTotalPages());

        return "account/list";
    }

    @GetMapping("/list/create")
    public String createAccountPage(Model model) {
        model.addAttribute("account", new Account());
        return "account/create";
    }

    @PostMapping("/list/create")
    public String createAccount(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role,   // Nhận trực tiếp là String
            @RequestParam String name,
            @RequestParam String address,
            @RequestParam String phone,
            Model model
    ) {
        Account account = new Account();
        account.setEmail(email);
        account.setPassword(passwordEncoder.encode(password));
        account.setRole(Role.valueOf(role.trim().toUpperCase())); // Ép thành Enum ở đây
        account.setName(name);
        account.setAddress(address);
        account.setPhone(phone);
        account.setIsActived(true);

        accountService.save(account);

        model.addAttribute("message", "Tạo tài khoản thành công!");
        return "redirect:/accounts/list";
    }


    @GetMapping("/list/edit/{id}")
    public String editAccountPage(@PathVariable int id, Model model, HttpSession session) {
        var account = accountService.findById(id);
        Account sessionAccount = (Account) session.getAttribute("account");
        if (sessionAccount != null && sessionAccount.getId() == id)
            return "redirect:/profile/edit";
        if (account.isPresent()) {
            model.addAttribute("account", account.get());
            return "account/edit";
        }
        return "redirect:/accounts/list"; // Nếu không tìm thấy tài khoản
    }

    @PostMapping("/list/edit/{id}")
    public String editAccount(@PathVariable int id,
                             @ModelAttribute Account account,
                             Model model,
                             HttpSession session) {
        var existingAccount = accountService.findById(id);
        if (existingAccount.isPresent()) {
            Account old = existingAccount.get();
            // Cập nhật từng trường từ account gửi lên
            old.setEmail(account.getEmail());
            old.setName(account.getName());
            old.setAddress(account.getAddress());
            old.setPhone(account.getPhone());
            old.setRole(account.getRole());
            old.setIsActived(account.getIsActived());
            // Xử lý password: nếu nhập mới thì đổi, không nhập thì giữ nguyên
            if (account.getPassword() != null && !account.getPassword().isBlank()) {
                old.setPassword(passwordEncoder.encode(account.getPassword()));
            }

            Account saved = accountService.save(old);

            model.addAttribute("message", "Cập nhật tài khoản thành công!");
        } else {
            model.addAttribute("error", "Không tìm thấy tài khoản!");
        }
        return "redirect:/accounts/list";
    }

    @GetMapping("/list/delete/{id}")
    public String deleteAccount(@PathVariable int id, Model model, HttpSession session) {
        Account sessionAccount = (Account) session.getAttribute("account");
        if (sessionAccount != null && sessionAccount.getId() == id) {
            model.addAttribute("message", "Bạn không thể tự vô hiệu hóa chính mình");
            return "redirect:/accounts/list";
        }
        accountService.deleteById(id);
        model.addAttribute("message", "Tài khoản đã bị vô hiệu hóa!");
        return "redirect:/accounts/list";
    }
}
