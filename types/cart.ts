export interface CartItem {
  id: string
  amount: number
  createdAt: string
  updatedAt: string

  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
}
