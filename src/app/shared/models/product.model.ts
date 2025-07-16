export interface Category {
  id: number;
  name: string;
}

export interface Size {
  id: number;
  name: string;
  price: number;
}

export interface Color {
  id: number;
  name: string;
  price: number;
}

export interface Material {
  id: number;
  name: string;
  price: number;
}

export interface Addon {
  id: number;
  name: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  brand: string;
  basePrice: number;
  status: boolean;
  imageUrl: string;
  quantity: number;
  careInstructions: string;
  category: Category;
  sizes: Size[];
  colors: Color[];
  materials: Material[];
  addons: Addon[];
}

export interface ProductsResponse {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CatalogData {
  categories: Category[];
  sizes: Size[];
  colors: Color[];
  materials: Material[];
  addons: Addon[];
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  sizeId?: number;
  colorId?: number;
  materialId?: number;
  page?: number;
  size?: number;
}
