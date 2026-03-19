import instance from "@/axios"

// ✅ Checkout (create order)
export const checkoutOrder = async () => {
  const res = await instance.post("/orders/checkout")
  return res.data
}

// ✅ My orders
export const getMyOrders = async () => {
  const res = await instance.get("/orders/my-orders")
  return res.data
}

// ✅ Cart checkout with buyerId (if required)
export const checkoutCart = async (buyerId: string) => {
  const res = await instance.post(`/cart/checkout/${buyerId}`)
  return res.data
}