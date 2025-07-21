package com.office_dress_shop.shopbackend.service;

import com.office_dress_shop.shopbackend.pojo.Account;
import com.office_dress_shop.shopbackend.repository.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    private AuthenticationRepository authRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender mailSender;

    @Override
    public Account authenticate(String email, String password) {
        Account account = authRepository.findAccountByEmail(email);
        if (account != null && Boolean.TRUE.equals(account.getIsActived()) && passwordEncoder.matches(password, account.getPassword())) {
            return account;
        }
        return null;
    }

    @Override
    public boolean forgotPassword(String email) {
        Account account = authRepository.findAccountByEmail(email);
        if (account == null) return false;
        String resetToken = UUID.randomUUID().toString();
        account.setResetToken(resetToken);
        account.setResetCodeExpiry(LocalDateTime.now().plusHours(1));
        authRepository.save(account);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Đặt Lại Mật Khẩu - Office Dress Shop");
        message.setText("Xin chào,\n\n" +
                "Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại Office Dress Shop.\n\n" +
                "Vui lòng click vào đường link bên dưới để đặt lại mật khẩu:\n" +
                "http://localhost:8080/auth/reset-password?token=" + resetToken + "\n\n" +
                "Lưu ý: Link này sẽ hết hạn sau 1 giờ.\n\n" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\n" +
                "Trân trọng,\n" +
                "Office Dress Shop Team");
        mailSender.send(message);
        return true;
    }

    @Override
    public boolean resetPassword(String token, String newPassword) {
        Account account = authRepository.findByResetToken(token);
        if (account == null || account.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
            return false;
        }
        account.setPassword(passwordEncoder.encode(newPassword));
        account.setResetToken(null);
        account.setResetCodeExpiry(null);
        authRepository.save(account);
        return true;
    }

    @Override
    public boolean register(Account account) {
        if (authRepository.findAccountByEmail(account.getEmail()) != null) {
            return false;
        }
        account.setPassword(passwordEncoder.encode(account.getPassword()));
        try {
            authRepository.save(account);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean emailExists(String email) {
        return authRepository.findAccountByEmail(email) != null;
    }
}

