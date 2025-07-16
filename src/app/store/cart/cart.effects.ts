import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { CartService } from '../../core/services/cart.service';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
  private actions$ = inject(Actions);
  private cartService = inject(CartService);

  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      mergeMap(() =>
        this.cartService.getCart().pipe(
          map(cart => CartActions.loadCartSuccess({ cart })),
          catchError(error => of(CartActions.loadCartFailure({
            error: error.message || 'Failed to load cart'
          })))
        )
      )
    )
  );

  addToCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToCart),
      mergeMap(({ request }) =>
        this.cartService.addToCart(request).pipe(
          mergeMap(() => this.cartService.getCart()),
          map(cart => CartActions.addToCartSuccess({ cart })),
          catchError(error => of(CartActions.addToCartFailure({
            error: error.message || 'Failed to add item to cart'
          })))
        )
      )
    )
  );

  updateCartItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.updateCartItem),
      mergeMap(({ itemId, request }) =>
        this.cartService.updateCartItem(itemId, request).pipe(
          mergeMap(() => this.cartService.getCart()),
          map(cart => CartActions.updateCartItemSuccess({ cart })),
          catchError(error => of(CartActions.updateCartItemFailure({
            error: error.message || 'Failed to update cart item'
          })))
        )
      )
    )
  );

  removeFromCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.removeFromCart),
      mergeMap(({ itemId }) =>
        this.cartService.removeFromCart(itemId).pipe(
          mergeMap(() => this.cartService.getCart()),
          map(cart => CartActions.removeFromCartSuccess({ cart })),
          catchError(error => of(CartActions.removeFromCartFailure({
            error: error.message || 'Failed to remove item from cart'
          })))
        )
      )
    )
  );

  clearCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.clearCart),
      mergeMap(() =>
        this.cartService.clearCart().pipe(
          map(() => CartActions.clearCartSuccess()),
          catchError(error => of(CartActions.clearCartFailure({
            error: error.message || 'Failed to clear cart'
          })))
        )
      )
    )
  );

  // Guest cart effects
  loadGuestCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadGuestCart),
      mergeMap(() =>
        this.cartService.getGuestCart().pipe(
          map(guestCart => CartActions.loadGuestCartSuccess({ guestCart })),
          catchError(() => of(CartActions.loadGuestCartSuccess({ 
            guestCart: { items: [], total: 0, itemCount: 0 } 
          })))
        )
      )
    )
  );

  addToGuestCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.addToGuestCart),
      mergeMap(({ item }) =>
        this.cartService.addToGuestCart(item).pipe(
          mergeMap(() => this.cartService.getGuestCart()),
          map(guestCart => CartActions.addToGuestCartSuccess({ guestCart })),
          catchError(() => of(CartActions.loadGuestCartSuccess({ 
            guestCart: { items: [], total: 0, itemCount: 0 } 
          })))
        )
      )
    )
  );


}
