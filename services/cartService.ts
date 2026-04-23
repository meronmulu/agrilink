import instance from "@/lib/axios/axios"

//  Add to cart
export const addToCart = async (data: {
  productId: string
  amount: number
}) => {
  try {

    const res = await instance.post("/cart", data)

    // console.log("ADD TO CART RESPONSE:", res.data)

    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//  Get cart
export const getCart = async () => {
  try {

    const res = await instance.get("/cart")

    // console.log(" FETCH CART RESPONSE:", res.data)

    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//  Update cart
export const updateCart = async (data: {
  productId: string
  amount: number
}) => {
  try {

    const res = await instance.patch("/cart", data)

    // console.log("UPDATE CART RESPONSE:", res.data)

    return res.data
  } catch (error) {
     console.log(error)
    throw error
  }
}

//  Remove item
export const removeCartItem = async (productId: string) => {
  try {

    const res = await instance.delete(`/cart/${productId}`)

    console.log("REMOVE ITEM RESPONSE:", res.data)

    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

//  Clear cart
export const clearCart = async () => {
  try {
    const res = await instance.delete("/cart/clear")

    return res.data
  } catch (error) {
    console.log("CLEAR CART ERROR:", error)
    throw error
  }
}