package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.enums.Role;
import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.service.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;
import java.util.ArrayList;

@Controller
@RequestMapping("/cart-items")
public class CartItemController {

    @Autowired
    private CartItemService cartItemService;
    @Autowired
    private CartService cartService;
    @Autowired
    private OfficeDressService officeDressService;
    @Autowired
    private SizeService sizeService;
    @Autowired
    private ColorService colorService;
    @Autowired
    private MaterialService materialService;
    @Autowired
    private AddonService addonService;
    @Autowired
    private AccountService accountService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private OrderDetailService orderDetailService;

    @ModelAttribute
    public void addRoleToModel(HttpSession session, Model model) {
        Account acc = (Account) session.getAttribute("account");
        if (acc != null) {
            model.addAttribute("role", acc.getRole().name());
        }
    }

    @GetMapping
    public String list(@RequestParam(required = false) Integer cartId,
                       Model model, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");

        model.addAttribute("role", acc.getRole().name());
        List<CartItem> cartItems;

        if (acc.getRole() == Role.ADMIN && cartId != null) {
            Cart selectedCart = cartService.findById(cartId).orElse(null);
            if (selectedCart != null) {
                cartItems = cartItemService.findByCartId(cartId);
                model.addAttribute("cartItems", cartItems);
                model.addAttribute("selectedCart", selectedCart);
            } else {
                return "redirect:/carts";
            }
        } else {
            Cart cart = cartService.getOrCreateCart(acc);
            cartItems = cartItemService.findByCartId(cart.getId());
            model.addAttribute("cartItems", cartItems);
            model.addAttribute("selectedCart", cart);
        }

        // Calculate total cart price
        double cartTotal = cartItems.stream()
                .mapToDouble(CartItem::calculateTotalPrice)
                .sum();
        double shippingFee = cartTotal > 0 ? 30000 : 0; // Shipping fee 30,000 VND
        
        model.addAttribute("account", acc);
        model.addAttribute("cartTotal", cartTotal);
        model.addAttribute("totalAmount", cartTotal);
        model.addAttribute("shippingFee", shippingFee);

        // Return user template for non-admin users
        if (acc.getRole() != Role.ADMIN) {
            return "user/cart/list";
        }

        return "cartitem/list";
    }


    @GetMapping("/add")
    public String showAddForm(
            @RequestParam(required = false) Integer productId,
            Model model,
            HttpSession session) {

        Account acc = (Account) session.getAttribute("account");

        CartItem cartItem = new CartItem();
        cartItem.setQuantity(1); // Default quantity

        // Handle pre-selected product
        if (productId != null) {
            OfficeDress selectedProduct = officeDressService.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            cartItem.setProduct(selectedProduct);
            model.addAttribute("selectedProduct", selectedProduct);
        }

        // Add all necessary data to model
        model.addAttribute("cartItem", cartItem);
        model.addAttribute("products", officeDressService.findAll());
        model.addAttribute("sizes", sizeService.findAll());
        model.addAttribute("colors", colorService.findAll());
        model.addAttribute("materials", materialService.findAll());
        model.addAttribute("addons", addonService.findAll());

        // Add accounts list for admin
        if (acc.getRole() == Role.ADMIN) {
            model.addAttribute("accounts", accountService.findAll());
        }

        return "cartitem/add";
    }

    @PostMapping("/add")
    public String add(
            @ModelAttribute CartItem cartItem,
            @RequestParam(required = false) Integer accountId,
            @RequestParam int productId,
            @RequestParam int sizeId,
            @RequestParam int colorId,
            @RequestParam int materialId,
            @RequestParam(required = false) List<Integer> addonIds,
            HttpSession session) {

        Account acc = (Account) session.getAttribute("account");

        // Set related entities
        cartItem.setProduct(officeDressService.findById(productId).orElseThrow());
        cartItem.setSize(sizeService.findById(sizeId).orElseThrow());
        cartItem.setColor(colorService.findById(colorId).orElseThrow());
        cartItem.setMaterial(materialService.findById(materialId).orElseThrow());
        if (addonIds != null && !addonIds.isEmpty()) {
            cartItem.setAddons(addonService.findAllById(addonIds));
        } else {
            cartItem.setAddons(new ArrayList<>());
        }

        // Determine which account's cart to use
        Account targetAccount;
        if (acc.getRole() == Role.ADMIN && accountId != null) {
            targetAccount = accountService.findById(accountId)
                    .orElseThrow(() -> new RuntimeException("Account not found"));
        } else {
            targetAccount = acc;
        }

        // Get or create cart for the target account
        Cart cart = cartService.getOrCreateCart(targetAccount);
        cartItem.setCart(cart);

        // Save the cart item
        cartItemService.save(cartItem);

        // Redirect to cart items list
        if (acc.getRole() == Role.ADMIN) {
            return "redirect:/cart-items?cartId=" + cart.getId();
        }
        return "redirect:/cart-items";
    }


    @GetMapping("/edit/{id}")
    public String editForm(@PathVariable int id, Model model, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");



        return cartItemService.findById(id)
                .filter(item -> acc.getRole() == Role.ADMIN || item.getCart().getAccount().getId() == acc.getId())
                .map(item -> {
                    model.addAttribute("cartItem", item);
                    model.addAttribute("products", officeDressService.findAll());
                    model.addAttribute("sizes", sizeService.findAll());
                    model.addAttribute("colors", colorService.findAll());
                    model.addAttribute("materials", materialService.findAll());
                    model.addAttribute("addons", addonService.findAll());
                    return "cartitem/edit";
                })
                .orElse("redirect:/cart-items");
    }

    @PostMapping("/edit/{id}")
    public String edit(@PathVariable int id, @ModelAttribute CartItem cartItem, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");

        CartItem existing = cartItemService.findById(id).orElse(null);
        if (existing == null ||
                (acc.getRole() != Role.ADMIN && existing.getCart().getAccount().getId() != acc.getId())) {
            return "redirect:/cart-items";
        }

        cartItem.setId(id);
        cartItem.setCart(existing.getCart());
        cartItemService.save(cartItem);

        if (acc.getRole() == Role.ADMIN) {
            return "redirect:/cart-items?cartId=" + existing.getCart().getId();
        }
        return "redirect:/cart-items";
    }

    @GetMapping("/{id}")
    public String detail(@PathVariable int id, Model model, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");
        CartItem cartItem = cartItemService.findById(id).orElse(null);

        boolean isAdmin = acc.getRole() == Role.ADMIN;
        boolean isOwner = cartItem.getCart().getAccount().getId() == acc.getId();

        if (!isAdmin && !isOwner) {
            return "redirect:/error";
        }

        return cartItemService.findById(id)
                .filter(item -> acc.getRole() == Role.ADMIN || item.getCart().getAccount().getId() == acc.getId())
                .map(item -> {
                    model.addAttribute("cartItem", item);
                    model.addAttribute("totalPrice", item.calculateTotalPrice());
                    model.addAttribute("role", acc.getRole().name());
                    return "cartitem/detail";
                })
                .orElse("redirect:/cart-items");
    }

    @GetMapping("/delete/{id}")
    public String delete(@PathVariable int id, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");

        CartItem item = cartItemService.findById(id).orElse(null);
        if (item == null) return "redirect:/cart-items";

        if (acc.getRole() != Role.ADMIN && item.getCart().getAccount().getId() != acc.getId()) {
            return "redirect:/cart-items";
        }

        int cartId = item.getCart().getId();
        cartItemService.deleteById(id);

        if (acc.getRole() == Role.ADMIN) {
            return "redirect:/cart-items?cartId=" + cartId;
        }
        return "redirect:/cart-items";
    }

    @PostMapping("/{id}/update")
    public String updateQuantity(@PathVariable int id, 
                                @RequestParam int quantity, 
                                HttpSession session) {
        Account acc = (Account) session.getAttribute("account");
        CartItem cartItem = cartItemService.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Check if user owns this cart item or is admin
        if (acc.getRole() != Role.ADMIN && cartItem.getCart().getAccount().getId() != acc.getId()) {
            throw new RuntimeException("Access denied");
        }

        cartItem.setQuantity(quantity);
        cartItemService.save(cartItem);
        return "redirect:/cart-items";
    }

    @PostMapping("/{id}/delete")
    public String deleteCartItem(@PathVariable int id, HttpSession session) {
        Account acc = (Account) session.getAttribute("account");
        CartItem cartItem = cartItemService.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        // Check if user owns this cart item or is admin
        if (acc.getRole() != Role.ADMIN && cartItem.getCart().getAccount().getId() != acc.getId()) {
            throw new RuntimeException("Access denied");
        }

        cartItemService.deleteById(id);
        return "redirect:/cart-items";
    }

    @PostMapping("/checkout")
    public String checkout(
            @RequestParam(required = false) String shippingAddress,
            @RequestParam(required = false) String[] quantities,
            HttpSession session,
            RedirectAttributes redirectAttributes) {
        Account acc = (Account) session.getAttribute("account");

        if (shippingAddress == null || shippingAddress.trim().isEmpty()) {
            shippingAddress = acc.getAddress();
        }

        try {
            Cart cart = cartService.getOrCreateCart(acc);
            
            // Update quantities if provided
            if (quantities != null && quantities.length > 0) {
                List<CartItem> cartItems = cartItemService.findByCartId(cart.getId());
                for (int i = 0; i < Math.min(quantities.length, cartItems.size()); i++) {
                    try {
                        int quantity = Integer.parseInt(quantities[i]);
                        if (quantity > 0) {
                            CartItem item = cartItems.get(i);
                            item.setQuantity(quantity);
                            cartItemService.save(item);
                        }
                    } catch (NumberFormatException e) {
                        // Ignore invalid quantity values
                    }
                }
            }
            
            Order order = orderDetailService.createOrderFromCart(acc, cart, shippingAddress);
            return "redirect:/orders/details/" + order.getId();
        } catch (IllegalStateException e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/cart-items";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "Đã xảy ra lỗi khi thanh toán");
            return "redirect:/cart-items";
        }
    }

}
