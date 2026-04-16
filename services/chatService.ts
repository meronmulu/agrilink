import instance from "@/lib/axios/axios"
import { Conversation, Message } from "@/types/chat";

type SendMessagePayload = {
  conversationId?: string
  receiverId: string
  message: string
}
// Returns the number of unread messages for the current user
export const getUnreadMessageCount = async (userId: string) => {
	const conversations = await getConversations();
	let unread = 0;
	conversations.forEach((conv: Conversation) => {
		const msgs = conv.messages || conv.chatMessages || conv.data || [];
		unread += msgs.filter((msg: Message) => msg.senderId !== userId && !msg.isRead).length;
	});
	return unread;
};



export const getConversations = async () => {
	try {
		const res = await instance.get(`/chat/conversations`)
		return Array.isArray(res.data) ? res.data : []
	} catch (error) {
		console.log("GET CONVERSATIONS ERROR:", error)
		return []
	}
}

export const sendMessage = async (
  data: SendMessagePayload | FormData
) => {
  try {
    const isFormData = data instanceof FormData

    const res = await instance.post('/chat/send', data, {
      headers: isFormData
        ? { 'Content-Type': 'multipart/form-data' }
        : { 'Content-Type': 'application/json' }
    })

    return res.data
  } catch (error) {
    console.log("SEND MESSAGE ERROR:", error)
    throw error
  }
}