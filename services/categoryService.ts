import instance from "@/axios"
import { Category, CreateCategoryPayload, CreateSubcategoryPayload, SubCategory } from "@/types/category"

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

  } catch (error) {
    console.log(error)
  }
}

export const updateCategory = async (id: string, data: { name: string }) => {
  try {
    const res = await instance.patch(`/category/${id}`, data)
    console.log(res)
    return res.data
  } catch (error) {
    console.log(error)
  }
  
}

export const deleteCategory = async (id: string) => {
  try {
    const res = await instance.delete(`/category/${id}`)
    return res.data
  } catch (error: any) {
    console.error('Delete category error:', error.response?.data || error.message)
    throw error  // <-- important, so the page knows it failed
  }
}




export const getSubCategories = async (): Promise<SubCategory[]> => {
  try {
    const res = await instance.get("/subcategory")
    return res.data
  } catch (error) {
    console.error("Get categories error:", error)
    return []
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



export const updateSubCategory = async (id: string, data: { name: string }) => {
   try {
    const res = await instance.patch(`/subcategory/${id}`, data)
    return res.data
   } catch (error) {
     console.log(error)
   }
  
}

export const deleteSubCategory = async (id: string) => {
  try {
    const res = await instance.delete(`/subcategory/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
  }
  
}