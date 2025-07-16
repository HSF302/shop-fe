import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';

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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private store: Store<{ auth: AuthState }>,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      address: ['']
    }, { validators: this.passwordMatchValidator });

    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  ngOnInit(): void {
    // Check if user is already authenticated
    this.store.select(AuthSelectors.selectCurrentUser).subscribe(user => {
      if (user) {
        this.router.navigate(['/products']);
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ userData }));

      // Listen for successful registration
      this.store.select(AuthSelectors.selectCurrentUser).subscribe(user => {
        if (user) {
          this.snackBar.open('Registration successful! Welcome!', 'Close', { duration: 3000 });
          this.router.navigate(['/products']);
        }
      });

      // Listen for registration errors
      this.error$.subscribe(error => {
        if (error) {
          this.snackBar.open(error, 'Close', { duration: 5000 });
        }
      });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  getNameErrorMessage(): string {
    const nameControl = this.registerForm.get('name');
    if (nameControl?.hasError('required')) {
      return 'Name is required';
    }
    if (nameControl?.hasError('minlength')) {
      return 'Name must be at least 2 characters long';
    }
    return '';
  }

  getEmailErrorMessage(): string {
    const emailControl = this.registerForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }
    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  }

  getConfirmPasswordErrorMessage(): string {
    const confirmPasswordControl = this.registerForm.get('confirmPassword');
    if (confirmPasswordControl?.hasError('required')) {
      return 'Please confirm your password';
    }
    if (confirmPasswordControl?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }

  getPhoneErrorMessage(): string {
    const phoneControl = this.registerForm.get('phone');
    if (phoneControl?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }
}
