import instance from "@/lib/axios/axios"
import { MarketPrice } from "@/types/market-place"


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
    const res = await instance.patch(`/market-price/approve/${id}`, {
    approve: true,
  })
  return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
  
}

export const rejectMarketPrice = async (id: string) => {
  try {
    const res = await instance.patch(`/market-price/approve/${id}`, {
      approve: false,
    })
    return res.data
  } catch (error) {
    console.log(error)
    throw error
  }
    
}










export const getApprovedMarketPrices = async (): Promise<MarketPrice[]> => {
  try {
     const res = await instance.get('/market-price/approved')
     console.log(res.data)
     return res.data

  } catch (error) {
     console.log(error)
     throw error
  }
 
}