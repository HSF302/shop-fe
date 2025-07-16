import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectProducts = createSelector(
  selectProductsState,
  (state: ProductsState) => state.products
);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state: ProductsState) => state.selectedProduct
);

export const selectFilters = createSelector(
  selectProductsState,
  (state: ProductsState) => state.filters
);

export const selectLoading = createSelector(
  selectProductsState,
  (state: ProductsState) => state.loading
);

export const selectError = createSelector(
  selectProductsState,
  (state: ProductsState) => state.error
);

export const selectTotalPages = createSelector(
  selectProductsState,
  (state: ProductsState) => state.totalPages
);

export const selectCurrentPage = createSelector(
  selectProductsState,
  (state: ProductsState) => state.currentPage
);

export const selectProductById = (id: number) => createSelector(
  selectProducts,
  (products) => products.find(product => product.id === id)
);
