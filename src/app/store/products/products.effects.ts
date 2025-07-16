import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { ProductsService } from '../../core/services/products.service';
import * as ProductsActions from './products.actions';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productsService = inject(ProductsService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      mergeMap(({ filters, page }) =>
        this.productsService.getProducts(filters, page).pipe(
          map(response => ProductsActions.loadProductsSuccess({
            products: response.products,
            totalPages: response.totalPages,
            currentPage: response.currentPage
          })),
          catchError(error => of(ProductsActions.loadProductsFailure({
            error: error.message || 'Failed to load products'
          })))
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      mergeMap(({ id }) =>
        this.productsService.getProduct(id).pipe(
          map(product => ProductsActions.loadProductSuccess({ product })),
          catchError(error => of(ProductsActions.loadProductsFailure({
            error: error.message || 'Failed to load product'
          })))
        )
      )
    )
  );


}
