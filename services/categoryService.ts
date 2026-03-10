import instance from "@/axios"
import { Category, CreateCategoryPayload, CreateSubcategoryPayload } from "@/types/category"

export const getCategories = async (): Promise<Category[]> => {
  try {
    const res = await instance.get("/category")
    return res.data
  } catch (error) {
    console.error("Get categories error:", error)
    return []
  }
}

export const addCategory = async (data: CreateCategoryPayload) => {
  try {
    console.log("Sending category:", data)

    const res = await instance.post("/category", data)

    console.log("Response:", res.data)
    return res.data

  } catch (error: any) {
    console.error("Add category error:", error?.response?.data || error)
    throw error
  }
}

export const addSubCategory = async (data: CreateSubcategoryPayload) => {
  try {
    const res = await instance.post("/subcategory", data)
    return res.data
  } catch (error) {
    console.error("Add subcategory error:", error)
    throw error
  }
}

export const updateCategory = async (id: string, data: { name: string }) => {
  const res = await instance.put(`/category/${id}`, data)
  return res.data
}

export const deleteCategory = async (id: string) => {
  const res = await instance.delete(`/category/${id}`)
  return res.data
}

export const updateSubCategory = async (id: string, data: { name: string }) => {
  const res = await instance.put(`/subcategory/${id}`, data)
  return res.data
}

export const deleteSubCategory = async (id: string) => {
  const res = await instance.delete(`/subcategory/${id}`)
  return res.data
}