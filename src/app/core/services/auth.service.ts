import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkCurrentUser();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        })
      );
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/session`)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
        })
      );
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/reset-password`, request);
  }

  private checkCurrentUser(): void {
    this.getCurrentUser().subscribe({
      next: (response) => {
        // User state is updated in the tap operator
      },
      error: () => {
        this.currentUserSubject.next(null);
      }
    });
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'ADMIN';
  }

  isCustomer(): boolean {
    return this.currentUserValue?.role === 'CUSTOMER';
  }

  isGuest(): boolean {
    return this.currentUserValue?.role === 'GUEST' || !this.isAuthenticated();
  }

  updateProfile(profileData: any): Observable<AuthResponse> {
    return this.http.put<AuthResponse>(`${this.apiUrl}/profile`, profileData)
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
}
