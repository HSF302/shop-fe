package com.office_dress_shop.shopbackend.pojo;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "OfficeDresses")
public class OfficeDress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "Description", nullable = false, columnDefinition = "NVARCHAR(1000) COLLATE Vietnamese_CI_AS")
    private String description;

    @Column(name = "Base_Price", nullable = false)
    private Double basePrice;

    @Column(name = "Status", nullable = false)
    private Boolean status;

    @Column(name = "Image_Url", columnDefinition = "NVARCHAR(500)")
    private String imageUrl;

    @Column(name = "Quantity", nullable = false)
    private int quantity;

    @OneToMany(mappedBy = "product", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private List<CartItem> cartItems;

    @ManyToOne
    @JoinColumn(name = "CategoryId")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "OfficeDress_Sizes",
            joinColumns = @JoinColumn(name = "office_dress_id"),
            inverseJoinColumns = @JoinColumn(name = "size_id")
    )
    private List<Size> sizes;

    @ManyToMany
    @JoinTable(
            name = "OfficeDress_Colors",
            joinColumns = @JoinColumn(name = "office_dress_id"),
            inverseJoinColumns = @JoinColumn(name = "color_id")
    )
    private List<Color> colors;

    @ManyToMany
    @JoinTable(
            name = "OfficeDress_Materials",
            joinColumns = @JoinColumn(name = "office_dress_id"),
            inverseJoinColumns = @JoinColumn(name = "material_id")
    )
    private List<Material> materials;

    @ManyToMany
    @JoinTable(
            name = "OfficeDress_Addons",
            joinColumns = @JoinColumn(name = "office_dress_id"),
            inverseJoinColumns = @JoinColumn(name = "addon_id")
    )
    private List<Addon> addons;

    public OfficeDress() {}

    public OfficeDress(String description, Double basePrice, Boolean status, String imageUrl, int quantity, List<CartItem> cartItems, Category category, List<Size> sizes, List<Color> colors, List<Material> materials, List<Addon> addons) {
        this.description = description;
        this.basePrice = basePrice;
        this.status = status;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.cartItems = cartItems;
        this.category = category;
        this.sizes = sizes;
        this.colors = colors;
        this.materials = materials;
        this.addons = addons;
    }

    public OfficeDress(int id, String description, Double basePrice, Boolean status, String imageUrl, int quantity, List<CartItem> cartItems, Category category, List<Size> sizes, List<Color> colors, List<Material> materials, List<Addon> addons) {
        this.id = id;
        this.description = description;
        this.basePrice = basePrice;
        this.status = status;
        this.imageUrl = imageUrl;
        this.quantity = quantity;
        this.cartItems = cartItems;
        this.category = category;
        this.sizes = sizes;
        this.colors = colors;
        this.materials = materials;
        this.addons = addons;
    }

    // Getters and setters

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public List<CartItem> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItem> cartItems) { this.cartItems = cartItems; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Size> getSizes() { return sizes; }
    public void setSizes(List<Size> sizes) { this.sizes = sizes; }

    public List<Color> getColors() { return colors; }
    public void setColors(List<Color> colors) { this.colors = colors; }

    public List<Material> getMaterials() { return materials; }
    public void setMaterials(List<Material> materials) { this.materials = materials; }

    public List<Addon> getAddons() { return addons; }
    public void setAddons(List<Addon> addons) { this.addons = addons; }
}
