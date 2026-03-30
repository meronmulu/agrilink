// services/aiService.ts

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

    // Return mock AI response as fallback
    const mockResponses = [
      "Based on current market trends, I recommend planting maize in the coming season. The demand is high and prices are stable.",
      "For pest management, consider using integrated pest management techniques. Neem oil and beneficial insects can be very effective.",
      "Your soil analysis shows good nutrient levels. I suggest applying organic compost to maintain soil health.",
      "Weather forecasts indicate good rainfall patterns for the next month. This is an ideal time for land preparation.",
      "Consider diversifying your crops. Adding legumes can improve soil fertility and provide additional income streams.",
      "For irrigation, drip irrigation systems can save up to 50% water compared to traditional methods.",
      "Market prices for teff are currently favorable. Consider harvesting soon to take advantage of current rates.",
      "I recommend joining local farmer cooperatives for better access to inputs, training, and market linkages."
    ]

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    return {
      response: randomResponse,
      timestamp: new Date().toISOString()
    }
  }
}