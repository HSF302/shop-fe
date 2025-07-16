import { AuthState } from './auth/auth.reducer';
import { ProductsState } from './products/products.state';
import { CartState } from './cart/cart.state';
import { OrdersState } from './orders/orders.state';

export interface AppState {
  auth: AuthState;
  products: ProductsState;
  cart: CartState;
  orders: OrdersState;
}
