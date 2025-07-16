import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrdersResponse, CheckoutRequest, OrderResponse, OrderStatus } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly API_URL = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(status?: string, email?: string, page: number = 0, size: number = 10): Observable<OrdersResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) params = params.set('status', status);
    if (email) params = params.set('email', email);

    return this.http.get<OrdersResponse>(this.API_URL, { 
      params, 
      withCredentials: true 
    });
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${this.API_URL}/${id}`, { withCredentials: true });
  }

  checkout(request: CheckoutRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.API_URL}/checkout`, request, { withCredentials: true });
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<OrderResponse> {
    return this.http.put<OrderResponse>(`${this.API_URL}/${id}/status`, { status }, { withCredentials: true });
  }
}
