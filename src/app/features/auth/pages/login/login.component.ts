import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { AuthState } from '../../../../store/auth/auth.reducer';
import * as AuthActions from '../../../../store/auth/auth.actions';
import * as AuthSelectors from '../../../../store/auth/auth.selectors';

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    this.store.select(AuthSelectors.selectCurrentUser).subscribe(user => {
      if (user) {
        this.redirectBasedOnRole(user.role);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;
      this.store.dispatch(AuthActions.login({ credentials }));

      // Listen for successful login
      this.store.select(AuthSelectors.selectCurrentUser).subscribe(user => {
        if (user) {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          this.redirectBasedOnRole(user.role);
        }
      });

      // Listen for login errors
      this.error$.subscribe(error => {
        if (error) {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
      });
    }
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'CUSTOMER':
        this.router.navigate(['/products']);
        break;
      default:
        this.router.navigate(['/products']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }
}
