
import axios from "axios"

const aiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL,
})

export const sendMessageToAI = async (message: string) => {
  try {
    const res = await aiInstance.post("/chat", {
      message,
      location: "Central Ethiopia",
    })

    console.log("AI RESPONSE:", res.data) 

    return res.data
  } catch (error: any) {
    console.error("AI API Error:", error.response?.data || error.message)
    throw error
  }
}