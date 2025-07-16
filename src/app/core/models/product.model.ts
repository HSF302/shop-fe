export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  brand: string;
  sku: string;
  imageUrl: string;
  quantity: number;
  status: boolean;
  careInstructions: string;
  category: Category;
  sizes: Size[];
  colors: Color[];
  materials: Material[];
  addons: Addon[];
}

export interface Category {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
  additionalPrice: number;
}

export interface Color {
  id: number;
  name: string;
  additionalPrice: number;
}

export interface Material {
  id: number;
  name: string;
  additionalPrice: number;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  material?: string;
  inStock?: boolean;
}

export interface ProductsResponse {
  products: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}