import { SubCategory } from "./category"

export type Product = {
  id: string
  name: string
  subCategoryId: string
  amount: number
  price: number
  description?: string
  image?: string
  createdAt: string

  subCategory?: SubCategory
//   farmer?: Farmer
}