import { Product } from '../../core/models/product.model';

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    size?: string;
    color?: string;
    brand?: string;
    material?: string;
    inStock?: boolean;
  };
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
}

export const initialProductsState: ProductsState = {
  products: [],
  selectedProduct: null,
  filters: {},
  loading: false,
  error: null,
  totalPages: 0,
  currentPage: 0
};