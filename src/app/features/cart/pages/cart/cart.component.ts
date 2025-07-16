import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CartItemComponent } from '../../components/cart-item/cart-item.component';
import { OrderSummaryComponent } from '../../components/order-summary/order-summary.component';

import { Cart, CartItem, GuestCart } from '../../../../core/models/cart.model';
import { AuthService } from '../../../../core/services/auth.service';
import * as CartActions from '../../../../store/cart/cart.actions';
import * as CartSelectors from '../../../../store/cart/cart.selectors';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    RouterModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    CartItemComponent,
    OrderSummaryComponent
  ]
})
export class CartComponent implements OnInit, OnDestroy {
  cart$: Observable<Cart | null>;
  guestCart$: Observable<GuestCart | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  isAuthenticated: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private store: Store,
    private authService: AuthService
  ) {
    this.cart$ = this.store.select(CartSelectors.selectCart);
    this.guestCart$ = this.store.select(CartSelectors.selectGuestCart);
    this.loading$ = this.store.select(CartSelectors.selectCartLoading);
    this.error$ = this.store.select(CartSelectors.selectCartError);
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.isAuthenticated = !!user;
      if (user) {
        this.store.dispatch(CartActions.loadCart());
      } else {
        this.store.dispatch(CartActions.loadGuestCart());
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onUpdateQuantity(itemId: number, quantity: number): void {
    if (this.isAuthenticated) {
      this.store.dispatch(CartActions.updateCartItem({ 
        itemId, 
        request: { quantity } 
      }));
    }
  }

  onRemoveItem(itemId: number): void {
    if (this.isAuthenticated) {
      this.store.dispatch(CartActions.removeFromCart({ itemId }));
    }
  }

  onRemoveGuestItem(itemIndex: number): void {
    if (!this.isAuthenticated) {
      this.store.dispatch(CartActions.removeFromGuestCart({ itemIndex }));
    }
  }

  onClearCart(): void {
    if (this.isAuthenticated) {
      this.store.dispatch(CartActions.clearCart());
    } else {
      this.store.dispatch(CartActions.clearGuestCart());
    }
  }

  onProceedToCheckout(): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/cart/checkout']);
    } else {
      // For guest users, redirect to guest checkout
      this.router.navigate(['/cart/checkout'], { queryParams: { guest: 'true' } });
    }
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  calculateItemTotal(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  trackByItemId(index: number, item: CartItem): number {
    return item.id;
  }
}
