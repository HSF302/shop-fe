import { createReducer, on } from '@ngrx/store';
import { ProductsState, initialProductsState } from './products.state';
import * as ProductsActions from './products.actions';

export const productsReducer = createReducer(
  initialProductsState,
  
  // Load Products
  on(ProductsActions.loadProducts, (state, { filters, page }) => ({
    ...state,
    loading: true,
    error: null,
    filters: filters || state.filters,
    currentPage: page !== undefined ? page : state.currentPage
  })),
  
  on(ProductsActions.loadProductsSuccess, (state, { products, totalPages, currentPage }) => ({
    ...state,
    products,
    totalPages,
    currentPage,
    loading: false,
    error: null
  })),
  
  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  // Load Single Product
  on(ProductsActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(ProductsActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
    error: null
  })),
  
  // Filters
  on(ProductsActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  })),
  
  on(ProductsActions.clearFilters, (state) => ({
    ...state,
    filters: {}
  }))
);
