import { User } from './user.model';
import { Product, Size, Color, Material, Addon } from './product.model';

export interface Order {
  id: number;
  account: User;
  orderDate: string;
  orderStatus: OrderStatus;
  status: string; // For compatibility
  totalAmount: number;
  shippingAddress: string;
  contactInfo?: string;
  orderDetails: OrderDetail[];
}

export interface OrderDetail {
  id: number;
  product: Product;
  size: Size | string;
  color: Color | string;
  material: Material | string;
  addons?: Addon[];
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  totalPrice: number; // For compatibility
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface CreateOrderRequest {
  shippingAddress: string;
}

export interface GuestOrderRequest {
  name: string;
  phone: string;
  email: string;
  shippingAddress: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}

export interface OrdersResponse {
  content: Order[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
