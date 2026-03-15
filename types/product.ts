import { User } from "./auth"
import { SubCategory } from "./category"

export type Product = {
  id: string
  name: string
  subCategoryId: string
  amount: number
  amountSold?: number
  price: number
  description?: string
  image?: string
  createdAt: string

  subCategory?: SubCategory
  farmer?: User 
}

export type CreateProductPayload = {
  name: string
  subCategoryId: string
  amount: number
  price: number
  description?: string
  image: Blob
}

export type UpdateProductPayload = {
  name?: string
  subCategoryId?: string
  amount?: number
  price?: number
  description?: string
  image?: Blob
}