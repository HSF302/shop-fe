package com.office_dress_shop.shopbackend.config;

import com.office_dress_shop.shopbackend.enums.Role;
import com.office_dress_shop.shopbackend.pojo.*;
import com.office_dress_shop.shopbackend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private AccountRepository accountRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private SizeRepository sizeRepository;
    
    @Autowired
    private ColorRepository colorRepository;
    
    @Autowired
    private MaterialRepository materialRepository;
    
    @Autowired
    private AddonRepository addonRepository;
    
    @Autowired
    private OfficeDressRepository officeDressRepository;
    
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Chỉ khởi tạo data nếu database trống
        if (accountRepository.count() == 0) {
            logger.info("Database is empty. Starting sample data initialization...");
            initializeData();
            logger.info("Sample data initialization completed successfully!");
        } else {
            logger.info("Database already contains data. Skipping sample data initialization.");
        }
    }

    private void initializeData() {
        logger.info("Creating sample data...");

        // 1. Tạo Categories
        logger.info("Creating categories...");
        Category businessCategory = new Category("Đồ công sở");
        Category casualCategory = new Category("Đồ dạo phố");
        Category formalCategory = new Category("Đồ dự tiệc");

        categoryRepository.saveAll(Arrays.asList(businessCategory, casualCategory, formalCategory));
        logger.info("Created {} categories", 3);

        // 2. Tạo Sizes
        logger.info("Creating sizes...");
        Size sizeS = new Size("S", 0.0);
        Size sizeM = new Size("M", 50000.0);
        Size sizeL = new Size("L", 100000.0);
        Size sizeXL = new Size("XL", 150000.0);

        sizeRepository.saveAll(Arrays.asList(sizeS, sizeM, sizeL, sizeXL));
        logger.info("Created {} sizes", 4);

        // 3. Tạo Colors
        logger.info("Creating colors...");
        Color blackColor = new Color("Đen", 0.0);
        Color whiteColor = new Color("Trắng", 0.0);
        Color navyColor = new Color("Xanh navy", 25000.0);
        Color grayColor = new Color("Xám", 25000.0);
        Color redColor = new Color("Đỏ", 50000.0);

        colorRepository.saveAll(Arrays.asList(blackColor, whiteColor, navyColor, grayColor, redColor));
        logger.info("Created {} colors", 5);

        // 4. Tạo Materials
        logger.info("Creating materials...");
        Material cottonMaterial = new Material("Cotton", 0.0);
        Material silkMaterial = new Material("Lụa", 200000.0);
        Material polyesterMaterial = new Material("Polyester", 50000.0);
        Material linenMaterial = new Material("Vải lanh", 100000.0);

        materialRepository.saveAll(Arrays.asList(cottonMaterial, silkMaterial, polyesterMaterial, linenMaterial));
        logger.info("Created {} materials", 4);

        // 5. Tạo Addons
        logger.info("Creating addons...");
        Addon beltAddon = new Addon("Thắt lưng", 150000.0);
        Addon scarfAddon = new Addon("Khăn choàng", 100000.0);
        Addon broochAddon = new Addon("Cài áo", 75000.0);
        Addon buttonAddon = new Addon("Nút áo cao cấp", 50000.0);

        addonRepository.saveAll(Arrays.asList(beltAddon, scarfAddon, broochAddon, buttonAddon));
        logger.info("Created {} addons", 4);

        // 6. Tạo Accounts
        logger.info("Creating accounts...");
        Account adminAccount = new Account();
        adminAccount.setEmail("admin@dressshop.com");
        adminAccount.setPassword(passwordEncoder.encode("admin123"));
        adminAccount.setRole(Role.ADMIN);
        adminAccount.setName("Quản trị viên");
        adminAccount.setAddress("123 Đường ABC, Quận 1, TP.HCM");
        adminAccount.setPhone("0901234567");
        adminAccount.setIsActived(true);
        
        Account customerAccount1 = new Account();
        customerAccount1.setEmail("customer1@gmail.com");
        customerAccount1.setPassword(passwordEncoder.encode("customer123"));
        customerAccount1.setRole(Role.CUSTOMER);
        customerAccount1.setName("Nguyễn Thị Lan");
        customerAccount1.setAddress("456 Đường DEF, Quận 2, TP.HCM");
        customerAccount1.setPhone("0912345678");
        customerAccount1.setIsActived(true);
        
        Account customerAccount2 = new Account();
        customerAccount2.setEmail("customer2@gmail.com");
        customerAccount2.setPassword(passwordEncoder.encode("customer123"));
        customerAccount2.setRole(Role.CUSTOMER);
        customerAccount2.setName("Trần Thị Hoa");
        customerAccount2.setAddress("789 Đường GHI, Quận 3, TP.HCM");
        customerAccount2.setPhone("0923456789");
        customerAccount2.setIsActived(true);
        
        accountRepository.saveAll(Arrays.asList(adminAccount, customerAccount1, customerAccount2));
        logger.info("Created {} accounts", 3);

        // 7. Tạo Carts cho customers
        logger.info("Creating carts...");
        Cart cart1 = new Cart();
        cart1.setAccount(customerAccount1);

        Cart cart2 = new Cart();
        cart2.setAccount(customerAccount2);

        cartRepository.saveAll(Arrays.asList(cart1, cart2));
        logger.info("Created {} carts", 2);

        // Update accounts with carts
        customerAccount1.setCart(cart1);
        customerAccount2.setCart(cart2);
        accountRepository.saveAll(Arrays.asList(customerAccount1, customerAccount2));

        // 8. Tạo OfficeDress products
        logger.info("Creating office dress products...");
        createOfficeDressProducts(businessCategory, casualCategory, formalCategory,
                Arrays.asList(sizeS, sizeM, sizeL, sizeXL),
                Arrays.asList(blackColor, whiteColor, navyColor, grayColor, redColor),
                Arrays.asList(cottonMaterial, silkMaterial, polyesterMaterial, linenMaterial),
                Arrays.asList(beltAddon, scarfAddon, broochAddon, buttonAddon));

        // 9. Tạo sample orders
        logger.info("Creating sample orders...");
        createSampleOrders(customerAccount1, customerAccount2);
    }

    private void createOfficeDressProducts(Category businessCategory, Category casualCategory, Category formalCategory,
                                         List<Size> sizes, List<Color> colors, List<Material> materials, List<Addon> addons) {

        // Váy công sở
        OfficeDress dress1 = new OfficeDress();
        dress1.setDescription("Váy công sở thanh lịch - Phong cách hiện đại");
        dress1.setBasePrice(1500000.0);
        dress1.setStatus(true);
        dress1.setImageUrl("/images/uploads/dress1.jpg");
        dress1.setQuantity(50);
        dress1.setCategory(businessCategory);
        dress1.setSizes(sizes);
        dress1.setColors(Arrays.asList(colors.get(0), colors.get(1), colors.get(2))); // Đen, Trắng, Navy
        dress1.setMaterials(Arrays.asList(materials.get(0), materials.get(2))); // Cotton, Polyester
        dress1.setAddons(Arrays.asList(addons.get(0), addons.get(3))); // Thắt lưng, Nút áo cao cấp

        OfficeDress dress2 = new OfficeDress();
        dress2.setDescription("Váy dạo phố trẻ trung - Thiết kế năng động");
        dress2.setBasePrice(1200000.0);
        dress2.setStatus(true);
        dress2.setImageUrl("/images/uploads/dress2.jpg");
        dress2.setQuantity(30);
        dress2.setCategory(casualCategory);
        dress2.setSizes(sizes);
        dress2.setColors(Arrays.asList(colors.get(2), colors.get(3), colors.get(4))); // Navy, Xám, Đỏ
        dress2.setMaterials(Arrays.asList(materials.get(0), materials.get(3))); // Cotton, Vải lanh
        dress2.setAddons(Arrays.asList(addons.get(1), addons.get(2))); // Khăn choàng, Cài áo

        OfficeDress dress3 = new OfficeDress();
        dress3.setDescription("Váy dự tiệc sang trọng - Chất liệu lụa cao cấp");
        dress3.setBasePrice(2500000.0);
        dress3.setStatus(true);
        dress3.setImageUrl("/images/uploads/dress3.jpg");
        dress3.setQuantity(20);
        dress3.setCategory(formalCategory);
        dress3.setSizes(sizes);
        dress3.setColors(Arrays.asList(colors.get(0), colors.get(4))); // Đen, Đỏ
        dress3.setMaterials(Arrays.asList(materials.get(1))); // Lụa
        dress3.setAddons(addons); // Tất cả addon

        OfficeDress dress4 = new OfficeDress();
        dress4.setDescription("Váy công sở basic - Phù hợp mọi dịp");
        dress4.setBasePrice(1000000.0);
        dress4.setStatus(true);
        dress4.setImageUrl("/images/uploads/dress4.jpg");
        dress4.setQuantity(40);
        dress4.setCategory(businessCategory);
        dress4.setSizes(sizes);
        dress4.setColors(Arrays.asList(colors.get(0), colors.get(1), colors.get(3))); // Đen, Trắng, Xám
        dress4.setMaterials(Arrays.asList(materials.get(0), materials.get(2))); // Cotton, Polyester
        dress4.setAddons(Arrays.asList(addons.get(0))); // Chỉ thắt lưng

        OfficeDress dress5 = new OfficeDress();
        dress5.setDescription("Váy dạo phố vintage - Phong cách cổ điển");
        dress5.setBasePrice(1800000.0);
        dress5.setStatus(true);
        dress5.setImageUrl("/images/uploads/dress5.jpg");
        dress5.setQuantity(25);
        dress5.setCategory(casualCategory);
        dress5.setSizes(sizes);
        dress5.setColors(colors); // Tất cả màu
        dress5.setMaterials(Arrays.asList(materials.get(3))); // Vải lanh
        dress5.setAddons(Arrays.asList(addons.get(1), addons.get(2), addons.get(3))); // Khăn, cài áo, nút áo

        officeDressRepository.saveAll(Arrays.asList(dress1, dress2, dress3, dress4, dress5));
        logger.info("Created {} office dress products", 5);
    }

    private void createSampleOrders(Account customer1, Account customer2) {
        // Lấy một số sản phẩm đã tạo
        List<OfficeDress> dresses = officeDressRepository.findAll();
        List<Size> sizes = sizeRepository.findAll();
        List<Color> colors = colorRepository.findAll();
        List<Material> materials = materialRepository.findAll();

        if (!dresses.isEmpty() && !sizes.isEmpty() && !colors.isEmpty() && !materials.isEmpty()) {
            // Order 1 cho customer1
            Order order1 = new Order();
            order1.setOrderDate(LocalDate.now().minusDays(5));
            order1.setOrderStatus("Đã giao");
            order1.setAccount(customer1);
            order1.setShippingAddress(customer1.getAddress());
            order1.setTotalAmount(1650000.0);

            orderRepository.save(order1);

            // Order 2 cho customer2
            Order order2 = new Order();
            order2.setOrderDate(LocalDate.now().minusDays(2));
            order2.setOrderStatus("Đang xử lý");
            order2.setAccount(customer2);
            order2.setShippingAddress(customer2.getAddress());
            order2.setTotalAmount(2750000.0);

            orderRepository.save(order2);
            logger.info("Created {} sample orders", 2);
        }
    }
}
