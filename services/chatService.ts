import instance from "@/axios"
import { Conversation, Message } from "@/types/chat";


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
		console.log("CONVERSATIONS API:", res.data)

		return Array.isArray(res.data) ? res.data : []
	} catch (error) {
		console.log("GET CONVERSATIONS ERROR:", error)
		return []
	}
}

// SEND message (Swagger unclear → keep flexible)
export const sendMessage = async (data: Message & { conversationId: string; receiverId: string }) => {
	try {
		console.log("SENDING:", data)

		const res = await instance.post(`/chat/send`, data)

			console.log(" SUCCESS:", res.data)
		return res.data

	} catch (error) {
		console.log("FULL ERROR:", error)
		console.log(" BACKEND RESPONSE:")

		throw error
	}
}