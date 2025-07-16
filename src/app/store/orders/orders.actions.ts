import { createAction, props } from '@ngrx/store';
import { Order, CreateOrderRequest, GuestOrderRequest, UpdateOrderStatusRequest } from '../../core/models/order.model';

// Load Orders
export const loadOrders = createAction(
  '[Orders] Load Orders',
  props<{ status?: string; page?: number; size?: number }>()
);

export const loadOrdersSuccess = createAction(
  '[Orders] Load Orders Success',
  props<{ orders: Order[]; totalPages: number; currentPage: number }>()
);

export const loadOrdersFailure = createAction(
  '[Orders] Load Orders Failure',
  props<{ error: string }>()
);

// Load Single Order
export const loadOrder = createAction(
  '[Orders] Load Order',
  props<{ id: number }>()
);

export const loadOrderSuccess = createAction(
  '[Orders] Load Order Success',
  props<{ order: Order }>()
);

export const loadOrderFailure = createAction(
  '[Orders] Load Order Failure',
  props<{ error: string }>()
);

// Create Order
export const createOrder = createAction(
  '[Orders] Create Order',
  props<{ request: CreateOrderRequest }>()
);

export const createOrderSuccess = createAction(
  '[Orders] Create Order Success',
  props<{ order: Order }>()
);

export const createOrderFailure = createAction(
  '[Orders] Create Order Failure',
  props<{ error: string }>()
);

// Create Guest Order
export const createGuestOrder = createAction(
  '[Orders] Create Guest Order',
  props<{ request: GuestOrderRequest }>()
);

export const createGuestOrderSuccess = createAction(
  '[Orders] Create Guest Order Success',
  props<{ order: Order }>()
);

export const createGuestOrderFailure = createAction(
  '[Orders] Create Guest Order Failure',
  props<{ error: string }>()
);

// Update Order Status (Admin)
export const updateOrderStatus = createAction(
  '[Orders] Update Order Status',
  props<{ orderId: number; request: UpdateOrderStatusRequest }>()
);

export const updateOrderStatusSuccess = createAction(
  '[Orders] Update Order Status Success',
  props<{ order: Order }>()
);

export const updateOrderStatusFailure = createAction(
  '[Orders] Update Order Status Failure',
  props<{ error: string }>()
);
