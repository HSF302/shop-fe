import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../../../core/models/user.model';
import { AuthState } from '../../../../store/auth/auth.state';
import { updateProfile, changePassword } from '../../../../store/auth/auth.actions';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTabsModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  user$: Observable<User | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: AuthState }>
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.user$ = this.store.select(state => state.auth.user);
    this.loading$ = this.store.select(state => state.auth.loading);
    this.error$ = this.store.select(state => state.auth.error);
  }

  ngOnInit() {
    this.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          address: user.address || ''
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onUpdateProfile() {
    if (this.profileForm.valid) {
      const profileData = this.profileForm.value;
      this.store.dispatch(updateProfile({ profileData }));
    }
  }

  onChangePassword() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      this.store.dispatch(changePassword({ currentPassword, newPassword }));
      this.passwordForm.reset();
    }
  }
}
