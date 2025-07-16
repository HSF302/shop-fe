import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Cart } from '../../../../core/models/cart.model';
import { User } from '../../../../core/models/user.model';
import { CartState } from '../../../../store/cart/cart.state';
import { AuthState } from '../../../../store/auth/auth.state';
import { placeOrder } from '../../../../store/cart/cart.actions';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cart$: Observable<Cart | null>;
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ cart: CartState; auth: AuthState }>,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]]
    });

    this.cart$ = this.store.select(state => state.cart.cart);
    this.user$ = this.store.select(state => state.auth.user);
    this.loading$ = this.store.select(state => state.cart.loading);
    this.error$ = this.store.select(state => state.cart.error);
  }

  ngOnInit() {
    // Pre-fill form with user data if logged in
    this.user$.subscribe(user => {
      if (user) {
        this.checkoutForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        });
      }
    });
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      const formValue = this.checkoutForm.value;
      const shippingAddress = `${formValue.address}, ${formValue.city}, ${formValue.postalCode}`;
      
      this.store.dispatch(placeOrder({ 
        shippingAddress,
        contactInfo: {
          name: formValue.name,
          email: formValue.email,
          phone: formValue.phone
        }
      }));
    }
  }

  goBack() {
    this.router.navigate(['/cart']);
  }

  calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.totalPrice, 0);
  }

  getAddonNames(addons: any[]): string {
    return addons.map(addon => addon.name).join(', ');
  }
}
