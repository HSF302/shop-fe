import { Product, Size, Color, Material, Addon } from './product.model';

export interface CartItem {
  id: number;
  product: Product;
  size: Size;
  color: Color;
  material: Material;
  addons: Addon[];
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
}

export interface CartResponse {
  success: boolean;
  message?: string;
  cart?: Cart;
  items?: CartItem[];
  totalItems?: number;
  totalAmount?: number;
}

export interface AddToCartRequest {
  productId: number;
  sizeId: number;
  colorId: number;
  materialId: number;
  addonIds: number[];
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
