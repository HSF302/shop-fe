import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCart = createSelector(
  selectCartState,
  (state: CartState) => state.cart
);

export const selectGuestCart = createSelector(
  selectCartState,
  (state: CartState) => state.guestCart
);

export const selectCartItems = createSelector(
  selectCart,
  (cart) => cart?.items || []
);

export const selectGuestCartItems = createSelector(
  selectGuestCart,
  (guestCart) => guestCart?.items || []
);

export const selectCartItemCount = createSelector(
  selectCart,
  (cart) => cart?.itemCount || 0
);

export const selectGuestCartItemCount = createSelector(
  selectGuestCart,
  (guestCart) => guestCart?.itemCount || 0
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart?.totalAmount || 0
);

export const selectGuestCartTotal = createSelector(
  selectGuestCart,
  (guestCart) => guestCart?.total || 0
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state: CartState) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state: CartState) => state.error
);

export const selectIsCartEmpty = createSelector(
  selectCartItems,
  (items) => items.length === 0
);

export const selectIsGuestCartEmpty = createSelector(
  selectGuestCartItems,
  (items) => items.length === 0
);
