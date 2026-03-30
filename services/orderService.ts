import instance from "@/axios"
import { Order } from "@/types/order"

export interface CheckoutOrderPayload {
  items: {
    productId: string
    amount: number
  }[]
}

export const checkoutOrder = async (data: CheckoutOrderPayload) => {
  try {
    const res = await instance.post("/orders/checkout", data)
    console.log("Data:", res.data)
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}


export const getMyOrders = async () => {
  try {
    const res = await instance.get("/orders/my-orders")
    console.log(res)
    return res.data
  } catch (error) {
     console.log(error)
  }
  
}

export const getFarmerOrders = async () => {
  try {
    const res = await instance.get("/orders/farmer-orders")
    console.log(res.data)
    return res.data
  } catch (error) {
     console.log(error)
  }
  
}

