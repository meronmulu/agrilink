import instance from "@/axios"
import { Order } from "@/types/order"

export const checkoutOrder = async (data: Order) => {
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

