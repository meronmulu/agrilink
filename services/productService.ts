import instance from "@/lib/axios/axios";
import { CreateAllProductsPayload, CreateProductPayload, Product } from "@/types/product";



export const addProducts = async (data: CreateProductPayload) => {
  try {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("subCategoryId", data.subCategoryId)
    formData.append("amount", String(data.amount))
    formData.append("price", String(data.price))
    formData.append("city", data.city)
formData.append("withDelivery", String(data.withDelivery))

    if (data.description) {
      formData.append("description", data.description)
    }

    formData.append("image", data.image)

    const res = await instance.post("/product", formData)
    console.log("add product response:", res.data)
    return res.data
  } catch (error) {
    console.log(" ERROR:", error)
    //  console.log("STATUS:", error?.response?.status)
    // console.log("ERROR DATA:", error?.response?.data)
    throw error
  }
}
export const getProducts= async (): Promise<Product[]> => {
  try {
    const res = await instance.get("/product")
    console.log(res.data)
    return res.data
  } catch (error) {
    console.error("Get products error:", error)
    return []
  }
}

export const getMyProducts = async (): Promise<Product[]> => {
  try {
    const res = await instance.get<Product[]>("/product/my-products")
    console.log("my products:", res.data)
    return res.data
  } catch (error) {
    console.error("Get products error:", error)
    return []
  }
}

export const getProductById = async (id: string) => {
  try {
    const res = await instance.get(`/product/${id}`)
    console.log(res.data)
    return res.data
  } catch (error) {
    console.log("Get product by id error:", error)
    throw error
  }
}

export const updateProduct = async (
  id: string,
  data: {
    name: string
    subCategoryId: string
    amount: number
    price: number
    description?: string
    city: string
    withDelivery?: boolean
    image?: Blob | null
  }
) => {
  try {
    const formData = new FormData()

    formData.append("name", data.name)
    formData.append("subCategoryId", data.subCategoryId)
    formData.append("amount", String(data.amount))
    formData.append("price", String(data.price))
    formData.append("city", data.city)
    formData.append("withDelivery", String(data.withDelivery))
    if (data.description) {
      formData.append("description", data.description)
    }

    // Only append image if it exists
    if (data.image) {
      formData.append("image", data.image)
    }

    const res = await instance.patch(`/product/${id}`, formData)

    return res.data
  } catch (error) {
    console.log("Update product error:", error)
    throw error
  }
}




export const deleteProducts = async (id: string) => {
  try {
    const res = await instance.delete(`/product/${id}`)
    return res.data
  } catch (error) {
    console.log(error)
    throw error  
  }
}

export const addAllProducts = async (data: CreateAllProductsPayload) => {
  try {
    console.log("Sending product:", data)

    const res = await instance.post("/all-product", data)

    console.log("Response:", res.data)

    return res.data
  } catch (errors) {
    console.error("Add product error:")

    throw new Error(
       "Failed to create product"
    )
  }
}



// GET all products
export const getAllProducts = async () => {
  const res = await instance.get("/all-product")
  return res.data
}

// DELETE product
export const deleteAllProduct = async (id: string) => {
  const res = await instance.delete(`/all-product/${id}`)
  return res.data
}

// UPDATE product (basic example)
// export const updateAllProduct = async (id: string, data: any) => {
//   const res = await instance.put(`/all-product/${id}`, data)
//   return res.data
// }
