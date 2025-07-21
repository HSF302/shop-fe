package com.office_dress_shop.shopbackend.pojo;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "CartItems")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CartId", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ProductId", nullable = false)
    private OfficeDress product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "SizeId", nullable = false)
    private Size size;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ColorId", nullable = false)
    private Color color;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "MaterialId", nullable = false)
    private Material material;

    @ManyToMany
    @JoinTable(
            name = "cart_item_addons",
            joinColumns = @JoinColumn(name = "cart_item_id"),
            inverseJoinColumns = @JoinColumn(name = "addon_id")
    )
    private List<Addon> addons = new ArrayList<>();

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    public CartItem() {
    }

    public CartItem(Cart cart, OfficeDress product, Size size, Color color, Material material, List<Addon> addons, int quantity) {
        this.cart = cart;
        this.product = product;
        this.size = size;
        this.color = color;
        this.material = material;
        this.addons = addons;
        this.quantity = quantity;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Cart getCart() {
        return cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public OfficeDress getProduct() {
        return product;
    }

    public void setProduct(OfficeDress product) {
        this.product = product;
    }

    public Size getSize() {
        return size;
    }

    public void setSize(Size size) {
        this.size = size;
    }

    public Color getColor() {
        return color;
    }

    public void setColor(Color color) {
        this.color = color;
    }

    public Material getMaterial() {
        return material;
    }

    public void setMaterial(Material material) {
        this.material = material;
    }

    public List<Addon> getAddons() {
        return addons;
    }

    public void setAddons(List<Addon> addons) {
        this.addons = addons;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double calculateTotalPrice() {
        double basePrice = this.product.getBasePrice();
        double sizePrice = this.size != null ? this.size.getPrice() : 0;
        double colorPrice = this.color != null ? this.color.getPrice() : 0;
        double materialPrice = this.material != null ? this.material.getPrice() : 0;

        // Calculate addons total
        double addonsPrice = 0;
        if (this.addons != null) {
            addonsPrice = this.addons.stream()
                    .mapToDouble(Addon::getPrice)
                    .sum();
        }

        // Calculate total for one item
        double singleItemPrice = basePrice + sizePrice + colorPrice + materialPrice + addonsPrice;

        // Multiply by quantity
        return singleItemPrice * this.quantity;
    }
}
