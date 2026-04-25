import instance from "@/lib/axios/axios"
import { MarketPrice } from "@/types/marketprice"


export const getMarketPrices = async (): Promise<MarketPrice[]> => {
    try {
       const res = await instance.get("/market-price")
       console.log(res.data)
       return res.data 
    } catch (error) {
         console.log(error)
            throw error
    }
  
}

export const approveMarketPrice = async (id: string) => {
  try {
    const res = await instance.patch(`/market-price/approve/${id}`)

    return res.data
  } catch (error) {
    console.log("Approve market price failed:", error)
    throw error
  }
}