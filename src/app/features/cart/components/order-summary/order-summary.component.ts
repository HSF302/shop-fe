import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Cart } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css']
})
export class OrderSummaryComponent {
  @Input() cart: Cart | null = null;
  @Input() showCheckoutButton: boolean = true;
  @Output() checkout = new EventEmitter<void>();

  calculateSubtotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.1; // 10% tax
  }

  calculateShipping(): number {
    return this.calculateSubtotal() > 100 ? 0 : 10; // Free shipping over $100
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax() + this.calculateShipping();
  }

  onCheckout() {
    this.checkout.emit();
  }
}
