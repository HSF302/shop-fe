import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { selectCurrentUser, selectIsAuthenticated } from '../../../store/auth/auth.selectors';
import * as AuthActions from '../../../store/auth/auth.actions';
import { CartService } from '../../services/cart.service';
import { MatDividerModule } from '@angular/material/divider';

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
      <div class="header-container">
        <!-- Logo -->
        <div class="logo-section">
          <a routerLink="/home" class="logo-link">
            <mat-icon>store</mat-icon>
            <span class="logo-text">Office Dress Shop</span>
          </a>
        </div>

        <!-- Navigation -->
        <nav class="nav-section">
          <a mat-button routerLink="/home" routerLinkActive="active">Home</a>
          <a mat-button routerLink="/products" routerLinkActive="active">Products</a>
          
          <ng-container *ngIf="isAuthenticated$ | async">
            <a mat-button routerLink="/orders" routerLinkActive="active">Orders</a>
            <a mat-button routerLink="/account" routerLinkActive="active">Account</a>
          </ng-container>
          
          <ng-container *ngIf="(currentUser$ | async)?.role === 'ADMIN'">
            <a mat-button routerLink="/admin" routerLinkActive="active">Admin</a>
          </ng-container>
        </nav>

        <!-- User Actions -->
        <div class="actions-section">
          <!-- Cart -->
          <ng-container *ngIf="isAuthenticated$ | async">
            <a mat-icon-button routerLink="/cart" class="cart-button">
              <mat-icon [matBadge]="cartItemCount$ | async" matBadgeColor="accent">shopping_cart</mat-icon>
            </a>
          </ng-container>

          <!-- User Menu -->
          <ng-container *ngIf="isAuthenticated$ | async; else authButtons">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-menu-trigger">
              <mat-icon>account_circle</mat-icon>
              <span>{{ (currentUser$ | async)?.name }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/account">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </a>
              <a mat-menu-item routerLink="/orders">
                <mat-icon>receipt</mat-icon>
                <span>Orders</span>
              </a>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>

          <!-- Auth Buttons -->
          <ng-template #authButtons>
            <a mat-button routerLink="/auth/login">Login</a>
            <a mat-raised-button color="accent" routerLink="/auth/register">Register</a>
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

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .logo-section {
      display: flex;
      align-items: center;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
      font-weight: 500;
      font-size: 1.2rem;
    }

    .logo-text {
      margin-left: 8px;
    }

    .nav-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-section a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .actions-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .cart-button {
      margin-right: 8px;
    }

    .user-menu-trigger {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .header-container {
        padding: 0 8px;
      }
      
      .nav-section {
        display: none;
      }
      
      .logo-text {
        display: none;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser$: Observable<User | null>;
  isAuthenticated$: Observable<boolean>;
  cartItemCount$: Observable<number>;

  constructor(
    private store: Store,
    private cartService: CartService
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.cartItemCount$ = this.cartService.cartItemCount$;
  }

  ngOnInit(): void {
    // Check session on app start
    this.store.dispatch(AuthActions.checkSession());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
