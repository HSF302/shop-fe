package com.office_dress_shop.shopbackend.pojo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "Addons")
public class Addon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "Name", nullable = false, columnDefinition = "NVARCHAR(255) COLLATE Vietnamese_CI_AS")
    private String name;

    @Column(name = "Price", nullable = false)
    private Double price;

    public Addon() {
    }

    public Addon(String name, Double price) {
        this.name = name;
        this.price = price;
    }

    public Addon(int id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
