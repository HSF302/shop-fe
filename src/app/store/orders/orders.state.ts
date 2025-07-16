import { Order } from '../../core/models/order.model';

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export const initialOrdersState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0
};
