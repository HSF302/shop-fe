import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../models/order.model';

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: Order;
  orders?: Order[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(private http: HttpClient) {}

  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/user`);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/all`);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(orderData: any): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}`, orderData);
  }

  updateOrderStatus(orderId: number, status: string): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${orderId}/status`, { status });
  }

  cancelOrder(orderId: number): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${this.apiUrl}/${orderId}/cancel`, {});
  }
}
