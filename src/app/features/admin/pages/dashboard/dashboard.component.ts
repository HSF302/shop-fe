import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductsService } from '../../../../core/services/products.service';
import { OrdersService } from '../../../../core/services/orders.service';
import { AuthService } from '../../../../core/services/auth.service';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowStockProducts: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats$: Observable<DashboardStats>;
  loading = true;

  constructor(
    private router: Router,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private authService: AuthService
  ) {
    this.stats$ = this.loadDashboardStats();
  }

  ngOnInit() {
    this.stats$.subscribe(() => {
      this.loading = false;
    });
  }

  private loadDashboardStats(): Observable<DashboardStats> {
    return forkJoin({
      products: this.productsService.getProducts(),
      orders: this.ordersService.getAllOrders(),
      users: this.authService.getAllUsers()
    }).pipe(
      map(({ products, orders, users }) => {
        const productList = products.products || [];
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
        const lowStockProducts = productList.filter(product => product.quantity < 5).length;

        return {
          totalProducts: productList.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
          lowStockProducts
        };
      })
    );
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  navigateToProducts() {
    this.router.navigate(['/admin/products']);
  }

  navigateToOrders() {
    this.router.navigate(['/admin/orders']);
  }

  navigateToUsers() {
    this.router.navigate(['/admin/users']);
  }
}
