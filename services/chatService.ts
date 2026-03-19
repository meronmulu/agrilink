import instance from "@/axios"

export const getConversations = async () => {
  try {
    const res = await instance.get(`/chat/conversations`)
    console.log("CONVERSATIONS API:", res.data)

    return Array.isArray(res.data) ? res.data : []
  } catch (error) {
    console.log("GET CONVERSATIONS ERROR:", error)
    return []
  }
}

// SEND message (Swagger unclear → keep flexible)
export const sendMessage = async (data: any) => {
  try {
    console.log("📤 SENDING:", data)

    const res = await instance.post(`/chat/send`, data)

    console.log("✅ SUCCESS:", res.data)
    return res.data

  } catch (error: any) {
    console.log("❌ FULL ERROR:", error)
    console.log("❌ BACKEND RESPONSE:", error?.response?.data)

    throw error
  }
}