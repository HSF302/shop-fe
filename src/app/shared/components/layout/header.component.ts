import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import * as AuthActions from '../../../store/auth/auth.actions';
import * as CartSelectors from '../../../store/cart/cart.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="header-toolbar">
      <div class="toolbar-content">
        <!-- Logo and Brand -->
        <div class="brand-section" (click)="goHome()">
          <mat-icon class="brand-icon">store</mat-icon>
          <span class="brand-name">Office Dress Shop</span>
        </div>

        <!-- Navigation Links -->
        <div class="nav-links">
          <button mat-button routerLink="/products" routerLinkActive="active">
            <mat-icon>shopping_bag</mat-icon>
            Products
          </button>
          
          <button *ngIf="currentUser$ | async as user" mat-button routerLink="/account" routerLinkActive="active">
            <mat-icon>account_circle</mat-icon>
            My Account
          </button>
          
          <button *ngIf="isAdmin()" mat-button routerLink="/admin" routerLinkActive="active">
            <mat-icon>admin_panel_settings</mat-icon>
            Admin
          </button>
        </div>

        <!-- User Actions -->
        <div class="user-actions">
          <!-- Cart Button -->
          <button mat-icon-button routerLink="/cart" class="cart-button">
            <mat-icon matBadge="{{ cartItemCount$ | async }}" matBadgeColor="accent">shopping_cart</mat-icon>
          </button>

          <!-- User Menu -->
          <div *ngIf="currentUser$ | async as user; else guestActions" class="user-menu">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
              <mat-icon>account_circle</mat-icon>
              <span>{{ user.name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/account">
                <mat-icon>person</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item routerLink="/orders">
                <mat-icon>receipt_long</mat-icon>
                <span>My Orders</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </div>

          <!-- Guest Actions -->
          <ng-template #guestActions>
            <div class="guest-actions">
              <button mat-button routerLink="/auth/login" class="login-button">
                <mat-icon>login</mat-icon>
                Login
              </button>
              <button mat-raised-button color="accent" routerLink="/auth/register" class="register-button">
                <mat-icon>person_add</mat-icon>
                Sign Up
              </button>
            </div>
          </ng-template>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .toolbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .brand-section {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      .brand-icon {
        font-size: 2rem;
        width: 2rem;
        height: 2rem;
      }
      
      .brand-name {
        font-size: 1.2rem;
        font-weight: 600;
      }
    }

    .nav-links {
      display: flex;
      gap: 8px;
      
      button {
        display: flex;
        align-items: center;
        gap: 4px;
        
        &.active {
          background-color: rgba(255,255,255,0.1);
        }
      }
    }

    .user-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-button {
      position: relative;
    }

    .user-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .guest-actions {
      display: flex;
      gap: 8px;
      
      .login-button, .register-button {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .brand-name {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  cartItemCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.cartItemCount$ = this.store.select(CartSelectors.selectCartItemCount);
  }

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
