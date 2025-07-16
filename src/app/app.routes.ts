import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { GuestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/pages/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/pages/register/register.component').then(m => m.RegisterComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        canActivate: [GuestGuard]
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
        canActivate: [GuestGuard]
      }
    ]
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/pages/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'cart/checkout',
    loadComponent: () => import('./features/cart/pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'account',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./features/auth/pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/orders/pages/order-history/order-history.component').then(m => m.OrderHistoryComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./features/admin/pages/product-management/product-management.component').then(m => m.ProductManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/admin/pages/order-management/order-management.component').then(m => m.OrderManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./features/admin/pages/user-management/user-management.component').then(m => m.UserManagementComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/' }
];
