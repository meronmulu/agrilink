// types/cart.ts
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  seller: string;
  quantity: number;
  unit: string; // kg, pieces, etc.
  maxQuantity?: number; // available stock
}

export interface CartSummary {
  subtotal: number;
  delivery: number;
  total: number;
  itemCount: number;
}