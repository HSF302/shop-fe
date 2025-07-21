package com.office_dress_shop.shopbackend.pojo;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "OrderDate", nullable = false)
    private LocalDate orderDate;

    @Column(name = "OrderStatus", nullable = false, columnDefinition = "NVARCHAR(100) COLLATE Vietnamese_CI_AS")
    private String orderStatus;

    @Column(name = "TotalAmount", nullable = false)
    private Double totalAmount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "AccountId", nullable = false)
    private Account account;

    @Column(name = "ShippingAddress", nullable = false, columnDefinition = "NVARCHAR(500) COLLATE Vietnamese_CI_AS")
    private String shippingAddress;

    @OneToMany(mappedBy = "order", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetails = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        orderDate = LocalDate.now();
    }

    public Order() {
    }

    public Order(LocalDate orderDate, String orderStatus, Double totalAmount, Account account, String shippingAddress, List<OrderDetail> orderDetails) {
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
        this.account = account;
        this.shippingAddress = shippingAddress;
        this.orderDetails = orderDetails;
    }

    public Order(int id, LocalDate orderDate, String orderStatus, Double totalAmount, Account account, String shippingAddress, List<OrderDetail> orderDetails) {
        this.id = id;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
        this.account = account;
        this.shippingAddress = shippingAddress;
        this.orderDetails = orderDetails;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderDetail> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetail> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
