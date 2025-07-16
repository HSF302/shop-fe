import { User } from './user.model';
import { Product, Size, Color, Material, Addon } from './product.model';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderDetail {
  id: number;
  product: Product;
  size: Size;
  color: Color;
  material: Material;
  addons: Addon[];
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

export interface Order {
  id: number;
  orderDate: string;
  orderStatus: OrderStatus;
  totalAmount: number;
  account: User;
  shippingAddress: string;
  orderDetails: OrderDetail[];
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CheckoutRequest {
  shippingAddress: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order?: Order;
}
