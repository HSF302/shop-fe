import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartResponse, AddToCartRequest, UpdateCartItemRequest } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly API_URL = 'http://localhost:8080/api/cart';
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCountSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadCartItemCount();
  }

  getCart(): Observable<CartResponse> {
    return this.http.get<CartResponse>(this.API_URL, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.totalItems !== undefined) {
            this.cartItemCountSubject.next(response.totalItems);
          }
        })
      );
  }

  addToCart(request: AddToCartRequest): Observable<CartResponse> {
    return this.http.post<CartResponse>(`${this.API_URL}/add`, request, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loadCartItemCount();
        })
      );
  }

  updateCartItem(itemId: number, request: UpdateCartItemRequest): Observable<CartResponse> {
    return this.http.put<CartResponse>(`${this.API_URL}/items/${itemId}`, request, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loadCartItemCount();
        })
      );
  }

  removeCartItem(itemId: number): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/items/${itemId}`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.loadCartItemCount();
        })
      );
  }

  clearCart(): Observable<CartResponse> {
    return this.http.delete<CartResponse>(`${this.API_URL}/clear`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.cartItemCountSubject.next(0);
        })
      );
  }

  private loadCartItemCount(): void {
    this.getCart().subscribe({
      next: (response) => {
        if (response.success && response.totalItems !== undefined) {
          this.cartItemCountSubject.next(response.totalItems);
        }
      },
      error: () => {
        this.cartItemCountSubject.next(0);
      }
    });
  }

  getCartItemCount(): number {
    return this.cartItemCountSubject.value;
  }
}
