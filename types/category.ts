export interface Category {
  id: string
  name: string
}

export interface CreateCategoryPayload {
  name: string
}

export interface SubCategory {
  id: string
  name: string
  categoryId: string
  category?: Category
}

export interface CreateSubcategoryPayload {
  name: string
  categoryId: string
}