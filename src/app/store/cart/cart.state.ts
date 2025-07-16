import { Cart, GuestCart } from '../../core/models/cart.model';

export interface CartState {
  cart: Cart | null;
  guestCart: GuestCart | null;
  loading: boolean;
  error: string | null;
}

export const initialCartState: CartState = {
  cart: null,
  guestCart: null,
  loading: false,
  error: null
};
