import { createAction, props } from '@ngrx/store';
import { Product } from '../../core/models/product.model';

export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ filters?: any; page?: number }>()
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[]; totalPages: number; currentPage: number }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

export const loadProduct = createAction(
  '[Products] Load Product',
  props<{ id: number }>()
);

export const loadProductSuccess = createAction(
  '[Products] Load Product Success',
  props<{ product: Product }>()
);

export const setFilters = createAction(
  '[Products] Set Filters',
  props<{ filters: any }>()
);

export const clearFilters = createAction('[Products] Clear Filters');