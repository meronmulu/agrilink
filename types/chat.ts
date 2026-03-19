export interface Message {
  id: string
  message: string
  senderId: string
  createdAt: string
}

export interface Conversation {
  id: string
  user: {
    id: string
    name: string
  }
  lastMessage?: string
}