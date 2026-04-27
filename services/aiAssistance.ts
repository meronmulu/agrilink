import axios from "axios"

const aiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_URL,
})

export const sendMessageToAI = async (message: string) => {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const res = await aiInstance.post("/api/v1/chat", {
      message,
      location: "Central Ethiopia",
    }, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    })

    console.log("AI RESPONSE:", res.data)

    return res.data
  } catch (error: any) {
    console.error("AI API Error:", error.response?.data || error.message)

    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Failed to get response from AI service"
    )
  }
}