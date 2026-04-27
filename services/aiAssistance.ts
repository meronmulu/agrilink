import axios from "axios"

const aiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL,
})

export const sendMessageToAI = async (message: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    
    // Add timeout to prevent hanging
    const res = await aiInstance.post("/api/v1/chat", {
      message,
      location: "Central Ethiopia",
    }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      },
      timeout: 30000, // 30 second timeout
    })

    console.log("AI RESPONSE:", res.data)

    // Check if response has the expected structure
    if (!res.data || !res.data.response) {
      throw new Error("Invalid response format from AI service")
    }

    return res.data
  } catch (error: any) {
    console.error("AI API Error:", error.response?.data || error.message)

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      throw new Error("Request timed out. Please try again.")
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error("Cannot connect to AI service. Please check your connection.")
    }

    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please log in again.")
    }

    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.")
    }

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to get response from AI service"
    )
  }
}