import instance from "@/axios"
import { CartItem } from "@/types/cart"

// In your orderService.ts
export const checkoutOrder = async (data: any) => {
  try {
    console.log("=== CHECKOUT REQUEST ===")
    console.log("URL:", "/orders/checkout")
    console.log("Data being sent:", JSON.stringify(data, null, 2))
    console.log("Auth token:", localStorage.getItem('token')) // Check if token exists
    
    const res = await instance.post("/orders/checkout", data)
    
    console.log("=== CHECKOUT RESPONSE ===")
    console.log("Status:", res.status)
    console.log("Data:", res.data)
    
    return res.data
  } catch (error: any) {
    console.error("=== CHECKOUT ERROR ===")
    console.error("Status:", error.response?.status)
    console.error("Headers:", error.response?.headers)
    console.error("Data:", error.response?.data)
    console.error("Full error:", error)
    throw error
  }
}