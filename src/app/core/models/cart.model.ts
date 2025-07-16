import { Product, Size, Color, Material, Addon } from './product.model';

export interface Cart {
  id: number;
  items: CartItem[];
  totalAmount: number;
  itemCount: number;
}

export interface CartItem {
  id: number;
  product: Product;
  size: Size;
  color: Color;
  material: Material;
  addons?: Addon[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  sizeId: number;
  colorId: number;
  materialId: number;
  addonIds?: number[];
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface GuestCartItem {
  productId: number;
  sizeId: number;
  colorId: number;
  materialId: number;
  addonIds?: number[];
  quantity: number;
}

export interface GuestCart {
  items: GuestCartItem[];
  total: number;
  itemCount: number;
}
