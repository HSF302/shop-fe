package com.office_dress_shop.shopbackend.config.filter;

import com.office_dress_shop.shopbackend.pojo.Account;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // Các đường dẫn public
        if (isPublicPath(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        HttpSession session = request.getSession(false);
        Account account = session != null ? (Account) session.getAttribute("account") : null;

        // check session
        if (account == null) {
            response.sendRedirect("/error");
            return;
        }

        // has both role
        if (isBothPath(path) && (account.getRole() == null)) {
            response.sendRedirect("/error");
            return;
        }

        // has customer role
//        if (isCustomerPath(path) && (account.getRole() == null || !account.getRole().name().equals("CUSTOMER"))) {
//            response.sendRedirect("/error");
//            return;
//        }

        // has admin role
        if (isAdminPath(path) && (account.getRole() == null || !account.getRole().name().equals("ADMIN"))) {
            response.sendRedirect("/error");
            return;
        }

        filterChain.doFilter(request, response);
    }

private boolean isPublicPath(String path) {
    return path.startsWith("/auth/") ||
            path.startsWith("/css/") ||
            path.startsWith("/js/") ||
            path.startsWith("/images/") ||
            path.equals("/error") ||
            path.equals("/officedresses") ||
            path.matches("/officedresses/\\d+") ||
            path.matches("/officedresses\\?.+") ||
            path.equals("/");
}

    private boolean isBothPath(String path) {
        return path.startsWith("/profile") ||
                path.startsWith("/cart-items") ||
                path.startsWith("/orders");

    }

    public static boolean isAdminPath(String path) {
        return path.startsWith("/accounts/list") ||
                path.startsWith("addons") ||
                path.startsWith("/categories") ||
                path.startsWith("/colors") ||
                path.startsWith("/materials") ||
                path.startsWith("/sizes") ||
                path.startsWith("/carts") ||
                path.startsWith("/officedresses/")
                ;
    }

//    private boolean isCustomerPath(String path) {
//        return path.startsWith("/profile");
//    }

}
