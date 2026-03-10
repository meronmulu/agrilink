export interface Category {
  id: string
  name: string
}

export interface CreateCategoryPayload {
  name: string
}

export interface CreateSubcategoryPayload {
  name: string
  categoryId: string
}