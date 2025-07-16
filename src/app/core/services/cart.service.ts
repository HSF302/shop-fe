import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, AddToCartRequest, UpdateCartItemRequest, GuestCart, GuestCartItem } from '../models/cart.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly apiUrl = `${environment.apiUrl}/api/v1/cart`;
  private readonly guestApiUrl = `${environment.apiUrl}/api/v1/guest`;

  constructor(private http: HttpClient) {}

  // Authenticated user cart methods
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl);
  }

  addToCart(request: AddToCartRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/items`, request);
  }

  updateCartItem(itemId: number, request: UpdateCartItemRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/items/${itemId}`, request);
  }

  removeFromCart(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/items/${itemId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/clear`);
  }

  // Guest cart methods
  getGuestCart(): Observable<GuestCart> {
    return this.http.get<GuestCart>(`${this.guestApiUrl}/cart`);
  }

  addToGuestCart(item: GuestCartItem): Observable<any> {
    return this.http.post<any>(`${this.guestApiUrl}/cart/items`, item);
  }

  removeFromGuestCart(itemIndex: number): Observable<any> {
    return this.http.delete<any>(`${this.guestApiUrl}/cart/items/${itemIndex}`);
  }

  clearGuestCart(): Observable<any> {
    return this.http.delete<any>(`${this.guestApiUrl}/cart/clear`);
  }
}
