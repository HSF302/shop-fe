import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  imports: [
    MatChipsModule,
    MatCardModule,
    MatIconModule,
    CommonModule
  ]
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() viewDetails = new EventEmitter<Product>();

  onAddToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.product);
  }

  getProductImage(): string {
    if (!this.product.imageUrl) {
      return '/assets/images/placeholder-dress.jpg';
    }

    // Convert backend image URL to frontend asset path
    // Backend returns: /images/dress_1.jpg
    // Frontend needs: /assets/images/dress_1.jpg
    if (this.product.imageUrl.startsWith('/images/')) {
      return this.product.imageUrl.replace('/images/', '/assets/images/');
    }

    return this.product.imageUrl;
  }

  getFormattedPrice(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.product.basePrice);
  }

  isInStock(): boolean {
    return this.product.quantity > 0;
  }

  getStockStatus(): string {
    if (this.product.quantity === 0) {
      return 'Out of Stock';
    } else if (this.product.quantity < 5) {
      return 'Low Stock';
    }
    return 'In Stock';
  }

  getStockStatusClass(): string {
    if (this.product.quantity === 0) {
      return 'out-of-stock';
    } else if (this.product.quantity < 5) {
      return 'low-stock';
    }
    return 'in-stock';
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = '/assets/images/placeholder-dress.jpg';
  }
}
