import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse, SessionResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkSession();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.user) {
            this.currentUserSubject.next(response.user);
          }
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData, { withCredentials: true });
  }

  logout(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => {
          this.currentUserSubject.next(null);
        })
      );
  }

  checkSession(): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.API_URL}/session`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.authenticated && response.user) {
            this.currentUserSubject.next(response.user);
          } else {
            this.currentUserSubject.next(null);
          }
        })
      );
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/reset-password`, { token, newPassword });
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'ADMIN';
  }

  isCustomer(): boolean {
    const user = this.currentUserSubject.value;
    return user?.role === 'CUSTOMER';
  }
}
