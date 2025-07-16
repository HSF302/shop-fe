import { createAction, props } from '@ngrx/store';
import { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest, GuestCart, GuestCartItem } from '../../core/models/cart.model';

// Load Cart
export const loadCart = createAction('[Cart] Load Cart');

export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ cart: Cart }>()
);

export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

// Add to Cart
export const addToCart = createAction(
  '[Cart] Add to Cart',
  props<{ request: AddToCartRequest }>()
);

export const addToCartSuccess = createAction(
  '[Cart] Add to Cart Success',
  props<{ cart: Cart }>()
);

export const addToCartFailure = createAction(
  '[Cart] Add to Cart Failure',
  props<{ error: string }>()
);

// Update Cart Item
export const updateCartItem = createAction(
  '[Cart] Update Cart Item',
  props<{ itemId: number; request: UpdateCartItemRequest }>()
);

export const updateCartItemSuccess = createAction(
  '[Cart] Update Cart Item Success',
  props<{ cart: Cart }>()
);

export const updateCartItemFailure = createAction(
  '[Cart] Update Cart Item Failure',
  props<{ error: string }>()
);

// Remove from Cart
export const removeFromCart = createAction(
  '[Cart] Remove from Cart',
  props<{ itemId: number }>()
);

export const removeFromCartSuccess = createAction(
  '[Cart] Remove from Cart Success',
  props<{ cart: Cart }>()
);

export const removeFromCartFailure = createAction(
  '[Cart] Remove from Cart Failure',
  props<{ error: string }>()
);

// Clear Cart
export const clearCart = createAction('[Cart] Clear Cart');

export const clearCartSuccess = createAction(
  '[Cart] Clear Cart Success'
);

export const clearCartFailure = createAction(
  '[Cart] Clear Cart Failure',
  props<{ error: string }>()
);

// Guest Cart Actions
export const loadGuestCart = createAction('[Cart] Load Guest Cart');

export const loadGuestCartSuccess = createAction(
  '[Cart] Load Guest Cart Success',
  props<{ guestCart: GuestCart }>()
);

export const addToGuestCart = createAction(
  '[Cart] Add to Guest Cart',
  props<{ item: GuestCartItem }>()
);

export const addToGuestCartSuccess = createAction(
  '[Cart] Add to Guest Cart Success',
  props<{ guestCart: GuestCart }>()
);

export const removeFromGuestCart = createAction(
  '[Cart] Remove from Guest Cart',
  props<{ itemIndex: number }>()
);

export const removeFromGuestCartSuccess = createAction(
  '[Cart] Remove from Guest Cart Success',
  props<{ guestCart: GuestCart }>()
);

export const clearGuestCart = createAction('[Cart] Clear Guest Cart');

export const clearGuestCartSuccess = createAction(
  '[Cart] Clear Guest Cart Success'
);

// Place Order Actions
export const placeOrder = createAction(
  '[Cart] Place Order',
  props<{ shippingAddress: string; contactInfo?: any }>()
);

export const placeOrderSuccess = createAction(
  '[Cart] Place Order Success',
  props<{ order: any; message: string }>()
);

export const placeOrderFailure = createAction(
  '[Cart] Place Order Failure',
  props<{ error: string }>()
);
