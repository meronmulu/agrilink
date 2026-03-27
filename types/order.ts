export interface OrderItem {
  id: string
  amount: number
  priceAtOrder: number
  product: {
    name: string
    image: string
  }
}

export interface Order {
  id: string
  totalAmount: number
  status: string
  createdAt: string
  currency: string
  paymentUrl?: string

  buyer?: {
    email: string
  }

  items: OrderItem[]
}