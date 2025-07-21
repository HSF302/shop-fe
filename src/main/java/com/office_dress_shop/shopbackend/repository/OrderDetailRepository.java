package com.office_dress_shop.shopbackend.repository;

import com.office_dress_shop.shopbackend.pojo.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;



import java.util.List;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {
    Page<OrderDetail> findByOrderId(int orderId, Pageable pageable);
}
