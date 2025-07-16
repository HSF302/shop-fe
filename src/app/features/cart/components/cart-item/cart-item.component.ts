import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartItem } from '../../../../core/models/cart.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() updateQuantity = new EventEmitter<{itemId: number, quantity: number}>();
  @Output() removeItem = new EventEmitter<number>();

  onQuantityChange(newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= 99) {
      this.updateQuantity.emit({ itemId: this.item.id, quantity: newQuantity });
    }
  }

  onRemove(): void {
    this.removeItem.emit(this.item.id);
  }

  decreaseQuantity(): void {
    if (this.item.quantity > 1) {
      this.onQuantityChange(this.item.quantity - 1);
    }
  }

  increaseQuantity(): void {
    if (this.item.quantity < 99) {
      this.onQuantityChange(this.item.quantity + 1);
    }
  }

  getProductImage(): string {
    return this.item.product.imageUrl || '/assets/images/placeholder-dress.jpg';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  getItemTotal(): number {
    return this.item.unitPrice * this.item.quantity;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/placeholder-dress.jpg';
  }

  onQuantityInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newQuantity = parseInt(target.value, 10);
    this.onQuantityChange(newQuantity);
  }
}
