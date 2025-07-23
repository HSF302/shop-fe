package com.office_dress_shop.shopbackend.controller;

import com.office_dress_shop.shopbackend.service.AccountService;
import com.office_dress_shop.shopbackend.service.OrderService;
import com.office_dress_shop.shopbackend.service.OfficeDressService;
import com.office_dress_shop.shopbackend.service.CategoryService;
import com.office_dress_shop.shopbackend.service.ColorService;
import com.office_dress_shop.shopbackend.service.SizeService;
import com.office_dress_shop.shopbackend.service.MaterialService;
import com.office_dress_shop.shopbackend.service.AddonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ModelAttribute;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {
    @Autowired private AccountService accountService;
    @Autowired private OrderService orderService;
    @Autowired private OfficeDressService officeDressService;
    @Autowired private CategoryService categoryService;
    @Autowired private ColorService colorService;
    @Autowired private SizeService sizeService;
    @Autowired private MaterialService materialService;
    @Autowired private AddonService addonService;

    @GetMapping("")
    public String adminDashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/accounts")
    public String manageAccounts(@RequestParam(required = false) String search,
                                 @RequestParam(defaultValue = "0") int page,
                                 Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> accountPage = accountService.searchByNameOrEmail(search, page, 10);
        model.addAttribute("accounts", accountPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", accountPage.getTotalPages());
        return "admin/account/list";
    }

    @GetMapping("/accounts/add")
    public String addAccountForm(Model model) {
        model.addAttribute("account", new com.office_dress_shop.shopbackend.pojo.Account());
        return "admin/account/create";
    }
    @PostMapping("/accounts/add")
    public String addAccount(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Account account) {
        accountService.save(account);
        return "redirect:/admin/accounts";
    }
    @GetMapping("/accounts/edit/{id}")
    public String editAccountForm(@PathVariable int id, Model model) {
        var acc = accountService.findById(id);
        if (acc.isPresent()) {
            model.addAttribute("account", acc.get());
            return "admin/account/edit";
        }
        return "redirect:/admin/accounts";
    }
    @PostMapping("/accounts/edit/{id}")
    public String editAccount(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Account account) {
        account.setId(id);
        accountService.save(account);
        return "redirect:/admin/accounts";
    }
    @GetMapping("/accounts/delete/{id}")
    public String deleteAccount(@PathVariable int id) {
        accountService.deleteById(id);
        return "redirect:/admin/accounts";
    }

    @GetMapping("/orders")
    public String manageOrders(@RequestParam(required = false) String status,
                               @RequestParam(required = false) String email,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        model.addAttribute("statusTerm", status);
        model.addAttribute("emailTerm", email);
        Page<?> orderPage = orderService.searchOrdersByStatusAndEmail(status, email, page, 10);
        model.addAttribute("orders", orderPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", orderPage.getTotalPages());
        return "admin/order/list";
    }

    @GetMapping("/orders/delete/{id}")
    public String deleteOrder(@PathVariable int id) {
        orderService.deleteById(id);
        return "redirect:/admin/orders";
    }

    @PostMapping("/orders/update-status/{id}")
    public String updateOrderStatus(@PathVariable int id, @RequestParam String status) {
        try {
            orderService.updateOrderStatus(id, status);
            return "redirect:/admin/orders?success=true";
        } catch (Exception e) {
            return "redirect:/admin/orders?error=true";
        }
    }

    @GetMapping("/officedresses")
    public String manageDresses(@RequestParam(required = false) String search,
                                @RequestParam(defaultValue = "0") int page,
                                Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> dressPage = officeDressService.searchByName(search, page, 10);
        model.addAttribute("dresses", dressPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", dressPage.getTotalPages());
        return "admin/officedresses/list";
    }

    @GetMapping("/officedresses/add")
    public String addDressForm(Model model) {
        model.addAttribute("officeDress", new com.office_dress_shop.shopbackend.pojo.OfficeDress());
        model.addAttribute("categories", categoryService.findAll());
        model.addAttribute("sizes", sizeService.findAll());
        model.addAttribute("colors", colorService.findAll());
        model.addAttribute("materials", materialService.findAll());
        model.addAttribute("addons", addonService.findAll());
        return "admin/officedresses/create";
    }
    @PostMapping("/officedresses/add")
    public String addDress(@ModelAttribute com.office_dress_shop.shopbackend.pojo.OfficeDress dress,
                          @RequestParam(required = false) List<Integer> sizeIds,
                          @RequestParam(required = false) List<Integer> colorIds,
                          @RequestParam(required = false) List<Integer> materialIds,
                          @RequestParam(required = false) List<Integer> addonIds) {
        
        // Set sizes
        if (sizeIds != null && !sizeIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Size> sizes = sizeIds.stream()
                .map(id -> sizeService.findById(id).orElse(null))
                .filter(size -> size != null)
                .toList();
            dress.setSizes(sizes);
        }
        
        // Set colors
        if (colorIds != null && !colorIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Color> colors = colorIds.stream()
                .map(id -> colorService.findById(id).orElse(null))
                .filter(color -> color != null)
                .toList();
            dress.setColors(colors);
        }
        
        // Set materials
        if (materialIds != null && !materialIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Material> materials = materialIds.stream()
                .map(id -> materialService.findById(id).orElse(null))
                .filter(material -> material != null)
                .toList();
            dress.setMaterials(materials);
        }
        
        // Set addons
        if (addonIds != null && !addonIds.isEmpty()) {
            dress.setAddons(addonService.findAllById(addonIds));
        }
        
        // Set default status to false (inactive) for new products if not set
        if (dress.getStatus() == null) {
            dress.setStatus(false);
        }
        
        officeDressService.save(dress);
        return "redirect:/admin/officedresses";
    }
    @GetMapping("/officedresses/edit/{id}")
    public String editDressForm(@PathVariable int id, Model model) {
        var dress = officeDressService.findById(id);
        if (dress.isPresent()) {
            model.addAttribute("officeDress", dress.get());
            model.addAttribute("categories", categoryService.findAll());
            model.addAttribute("sizes", sizeService.findAll());
            model.addAttribute("colors", colorService.findAll());
            model.addAttribute("materials", materialService.findAll());
            model.addAttribute("addons", addonService.findAll());
            return "admin/officedresses/edit";
        }
        return "redirect:/admin/officedresses";
    }
    @PostMapping("/officedresses/edit/{id}")
    public String editDress(@PathVariable int id, 
                           @ModelAttribute com.office_dress_shop.shopbackend.pojo.OfficeDress dress,
                           @RequestParam(required = false) List<Integer> sizeIds,
                           @RequestParam(required = false) List<Integer> colorIds,
                           @RequestParam(required = false) List<Integer> materialIds,
                           @RequestParam(required = false) List<Integer> addonIds) {
        dress.setId(id);
        
        // Set sizes
        if (sizeIds != null && !sizeIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Size> sizes = sizeIds.stream()
                .map(sizeId -> sizeService.findById(sizeId).orElse(null))
                .filter(size -> size != null)
                .toList();
            dress.setSizes(sizes);
        }
        
        // Set colors
        if (colorIds != null && !colorIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Color> colors = colorIds.stream()
                .map(colorId -> colorService.findById(colorId).orElse(null))
                .filter(color -> color != null)
                .toList();
            dress.setColors(colors);
        }
        
        // Set materials
        if (materialIds != null && !materialIds.isEmpty()) {
            List<com.office_dress_shop.shopbackend.pojo.Material> materials = materialIds.stream()
                .map(materialId -> materialService.findById(materialId).orElse(null))
                .filter(material -> material != null)
                .toList();
            dress.setMaterials(materials);
        }
        
        // Set addons
        if (addonIds != null && !addonIds.isEmpty()) {
            dress.setAddons(addonService.findAllById(addonIds));
        }
        dress.setStatus(true);
        officeDressService.save(dress);
        return "redirect:/admin/officedresses";
    }
    @GetMapping("/officedresses/delete/{id}")
    public String deleteDress(@PathVariable int id) {
        officeDressService.deleteById(id);
        return "redirect:/admin/officedresses";
    }

    @GetMapping("/categories")
    public String manageCategories(@RequestParam(required = false) String search,
                                   @RequestParam(defaultValue = "0") int page,
                                   Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> categoryPage = categoryService.searchByName(search, page, 10);
        model.addAttribute("categories", categoryPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", categoryPage.getTotalPages());
        return "admin/category/list";
    }

    @GetMapping("/categories/add")
    public String addCategoryForm(Model model) {
        model.addAttribute("category", new com.office_dress_shop.shopbackend.pojo.Category());
        return "admin/category/create";
    }
    @PostMapping("/categories/add")
    public String addCategory(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Category category) {
        categoryService.save(category);
        return "redirect:/admin/categories";
    }
    @GetMapping("/categories/edit/{id}")
    public String editCategoryForm(@PathVariable int id, Model model) {
        var cat = categoryService.findById(id);
        if (cat.isPresent()) {
            model.addAttribute("category", cat.get());
            return "admin/category/edit";
        }
        return "redirect:/admin/categories";
    }
    @PostMapping("/categories/edit/{id}")
    public String editCategory(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Category category) {
        category.setId(id);
        categoryService.save(category);
        return "redirect:/admin/categories";
    }
    @GetMapping("/categories/delete/{id}")
    public String deleteCategory(@PathVariable int id) {
        categoryService.deleteById(id);
        return "redirect:/admin/categories";
    }

    @GetMapping("/colors")
    public String manageColors(@RequestParam(required = false) String search,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> colorPage = colorService.searchByName(search, page, 10);
        model.addAttribute("colors", colorPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", colorPage.getTotalPages());
        return "admin/color/list";
    }

    @GetMapping("/colors/add")
    public String addColorForm(Model model) {
        model.addAttribute("color", new com.office_dress_shop.shopbackend.pojo.Color());
        return "admin/color/create";
    }
    @PostMapping("/colors/add")
    public String addColor(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Color color) {
        colorService.save(color);
        return "redirect:/admin/colors?success=true";
    }
    @GetMapping("/colors/edit/{id}")
    public String editColorForm(@PathVariable int id, Model model) {
        var color = colorService.findById(id);
        if (color.isPresent()) {
            model.addAttribute("color", color.get());
            return "admin/color/edit";
        }
        return "redirect:/admin/colors";
    }
    @PostMapping("/colors/edit/{id}")
    public String editColor(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Color color) {
        try {
            color.setId(id);
            colorService.save(color);
            return "redirect:/admin/colors?success=true";
        } catch (Exception e) {
            return "redirect:/admin/colors?error=true";
        }
    }
    @GetMapping("/colors/delete/{id}")
    public String deleteColor(@PathVariable int id) {
        try {
            colorService.deleteById(id);
            return "redirect:/admin/colors?success=true";
        } catch (Exception e) {
            return "redirect:/admin/colors?error=true";
        }
    }

    @GetMapping("/sizes")
    public String manageSizes(@RequestParam(required = false) String search,
                              @RequestParam(defaultValue = "0") int page,
                              Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> sizePage = sizeService.searchByName(search, page, 10);
        model.addAttribute("sizes", sizePage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", sizePage.getTotalPages());
        return "admin/size/list";
    }

    @GetMapping("/sizes/add")
    public String addSizeForm(Model model) {
        model.addAttribute("size", new com.office_dress_shop.shopbackend.pojo.Size());
        return "admin/size/create";
    }
    @PostMapping("/sizes/add")
    public String addSize(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Size size) {
        sizeService.save(size);
        return "redirect:/admin/sizes?success=true";
    }
    @GetMapping("/sizes/edit/{id}")
    public String editSizeForm(@PathVariable int id, Model model) {
        var size = sizeService.findById(id);
        if (size.isPresent()) {
            model.addAttribute("size", size.get());
            return "admin/size/edit";
        }
        return "redirect:/admin/sizes";
    }
    @PostMapping("/sizes/edit/{id}")
    public String editSize(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Size size) {
        try {
            size.setId(id);
            sizeService.save(size);
            return "redirect:/admin/sizes?success=true";
        } catch (Exception e) {
            return "redirect:/admin/sizes?error=true";
        }
    }
    @GetMapping("/sizes/delete/{id}")
    public String deleteSize(@PathVariable int id) {
        try {
            sizeService.deleteById(id);
            return "redirect:/admin/sizes?success=true";
        } catch (Exception e) {
            return "redirect:/admin/sizes?error=true";
        }
    }

    @GetMapping("/materials")
    public String manageMaterials(@RequestParam(required = false) String search,
                                  @RequestParam(defaultValue = "0") int page,
                                  Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> materialPage = materialService.searchByName(search, page, 10);
        model.addAttribute("materials", materialPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", materialPage.getTotalPages());
        return "admin/material/list";
    }

    @GetMapping("/materials/add")
    public String addMaterialForm(Model model) {
        model.addAttribute("material", new com.office_dress_shop.shopbackend.pojo.Material());
        return "admin/material/create";
    }
    @PostMapping("/materials/add")
    public String addMaterial(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Material material) {
        materialService.save(material);
        return "redirect:/admin/materials?success=true";
    }
    @GetMapping("/materials/edit/{id}")
    public String editMaterialForm(@PathVariable int id, Model model) {
        var material = materialService.findById(id);
        if (material.isPresent()) {
            model.addAttribute("material", material.get());
            return "admin/material/edit";
        }
        return "redirect:/admin/materials";
    }
    @PostMapping("/materials/edit/{id}")
    public String editMaterial(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Material material) {
        try {
            material.setId(id);
            materialService.save(material);
            return "redirect:/admin/materials?success=true";
        } catch (Exception e) {
            return "redirect:/admin/materials?error=true";
        }
    }
    @GetMapping("/materials/delete/{id}")
    public String deleteMaterial(@PathVariable int id) {
        try {
            materialService.deleteById(id);
            return "redirect:/admin/materials?success=true";
        } catch (Exception e) {
            return "redirect:/admin/materials?error=true";
        }
    }

    @GetMapping("/addons")
    public String manageAddons(@RequestParam(required = false) String search,
                               @RequestParam(defaultValue = "0") int page,
                               Model model) {
        model.addAttribute("searchTerm", search);
        Page<?> addonPage = addonService.searchByName(search, page, 10);
        model.addAttribute("addons", addonPage.getContent());
        model.addAttribute("currentPage", page);
        model.addAttribute("totalPages", addonPage.getTotalPages());
        return "admin/addon/list";
    }

    @GetMapping("/addons/add")
    public String addAddonForm(Model model) {
        model.addAttribute("addon", new com.office_dress_shop.shopbackend.pojo.Addon());
        return "admin/addon/create";
    }
    @PostMapping("/addons/add")
    public String addAddon(@ModelAttribute com.office_dress_shop.shopbackend.pojo.Addon addon) {
        addonService.save(addon);
        return "redirect:/admin/addons";
    }
    @GetMapping("/addons/edit/{id}")
    public String editAddonForm(@PathVariable int id, Model model) {
        var addon = addonService.findById(id);
        if (addon.isPresent()) {
            model.addAttribute("addon", addon.get());
            return "admin/addon/edit";
        }
        return "redirect:/admin/addons";
    }
    @PostMapping("/addons/edit/{id}")
    public String editAddon(@PathVariable int id, @ModelAttribute com.office_dress_shop.shopbackend.pojo.Addon addon) {
        addon.setId(id);
        addonService.save(addon);
        return "redirect:/admin/addons";
    }
    @GetMapping("/addons/delete/{id}")
    public String deleteAddon(@PathVariable int id) {
        addonService.deleteById(id);
        return "redirect:/admin/addons";
    }
} 