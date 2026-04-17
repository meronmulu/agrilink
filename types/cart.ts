// types/cart.ts
export interface CartItem {
  id: string
  amount: number
  buyerId: string
  productId: string
  createdAt: string
  updatedAt: string
  product: {
    image: string
    id: string
    name: string
    price: number
    farmerId: string
    subCategoryId: string
    amount: number
    imageUrl?: string
  }
}