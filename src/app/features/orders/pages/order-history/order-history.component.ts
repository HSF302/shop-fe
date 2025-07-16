import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Order } from '../../../../core/models/order.model';
import { OrdersService } from '../../../../core/services/orders.service';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatExpansionModule
  ],
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  orders$: Observable<Order[]>;
  loading = false;
  error: string | null = null;

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) {
    this.orders$ = this.ordersService.getUserOrders();
  }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.orders$.subscribe({
      next: () => {
        this.loading = false;
        this.error = null;
      },
      error: (error) => {
        this.loading = false;
        this.error = 'Failed to load orders';
        console.error('Error loading orders:', error);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }

  formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/orders', orderId]);
  }

  reorderItems(order: Order) {
    // Add items from this order to cart
    order.orderDetails.forEach(detail => {
      // Dispatch action to add to cart
      console.log('Reordering item:', detail);
    });
  }

  trackByOrderId(index: number, order: Order): number {
    return order.id;
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/placeholder-dress.jpg';
  }
}
