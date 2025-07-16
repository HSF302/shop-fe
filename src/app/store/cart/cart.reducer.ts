import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialCartState,
  
  // Load Cart
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.loadCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null
  })),
  
  on(CartActions.loadCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Add to Cart
  on(CartActions.addToCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.addToCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null
  })),
  
  on(CartActions.addToCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Update Cart Item
  on(CartActions.updateCartItem, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.updateCartItemSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null
  })),
  
  on(CartActions.updateCartItemFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Remove from Cart
  on(CartActions.removeFromCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.removeFromCartSuccess, (state, { cart }) => ({
    ...state,
    cart,
    loading: false,
    error: null
  })),
  
  on(CartActions.removeFromCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Clear Cart
  on(CartActions.clearCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.clearCartSuccess, (state) => ({
    ...state,
    cart: null,
    loading: false,
    error: null
  })),
  
  on(CartActions.clearCartFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Guest Cart
  on(CartActions.loadGuestCart, (state) => ({
    ...state,
    loading: true
  })),
  
  on(CartActions.loadGuestCartSuccess, (state, { guestCart }) => ({
    ...state,
    guestCart,
    loading: false
  })),
  
  on(CartActions.addToGuestCartSuccess, (state, { guestCart }) => ({
    ...state,
    guestCart
  })),
  
  on(CartActions.removeFromGuestCartSuccess, (state, { guestCart }) => ({
    ...state,
    guestCart
  })),
  
  on(CartActions.clearGuestCartSuccess, (state) => ({
    ...state,
    guestCart: null
  }))
);
