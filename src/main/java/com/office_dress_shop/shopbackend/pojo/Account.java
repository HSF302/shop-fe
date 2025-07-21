package com.office_dress_shop.shopbackend.pojo;

import com.office_dress_shop.shopbackend.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "Accounts")
@Getter
@Setter
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "Email", unique = true, nullable = false, columnDefinition = "NVARCHAR(255) COLLATE Vietnamese_CI_AS")
    private String email;

    @Column(name = "Password", nullable = false, columnDefinition = "NVARCHAR(255)")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role", nullable = false, columnDefinition = "NVARCHAR(50)")
    private Role role;

    @Column(name = "Name", nullable = false, columnDefinition = "NVARCHAR(255) COLLATE Vietnamese_CI_AS")
    private String name;

    @Column(name = "Address", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Vietnamese_CI_AS")
    private String address;

    @Column(name = "Phone", nullable = false, columnDefinition = "NVARCHAR(20)")
    private String phone;

    @Column(name = "ResetToken", columnDefinition = "NVARCHAR(255)")
    private String resetToken;

    @Column(name = "reset_code_expiry")
    private LocalDateTime resetCodeExpiry;


    @OneToOne(mappedBy = "account", cascade = CascadeType.ALL)
    private Cart cart;

    @Column(name = "is_actived")
    private Boolean isActived = true;

    public Account() {
    }

    public Account(String email, String password, Role role, String name, String address, String phone, Cart cart) {
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.cart = cart;
    }

    public Account(int id, String email, String password, Role role, String name, String address, String phone, Cart cart) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.cart = cart;
    }
    public boolean isActived() {return isActived;}

    public boolean setActived(boolean isActived) {
        this.isActived = isActived;
        return this.isActived;
    }
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }
}
