export interface MarketPrice {
  id: string
  productId: string
  woredaId: string
  price: number
  latitude: string
  longitude: string
  createdAt?: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  product?: {
    name: string
    imageUrl?: string
  }
  woreda?: {
    name: string
  }
}