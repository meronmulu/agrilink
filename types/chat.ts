
export interface Message {
  id: string
  message: string
  senderId: string
  createdAt: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  user?: {
    id: string
    name: string
  }
  userOneId?: string
  userTwoId?: string
  messages?: Message[]
  chatMessages?: Message[]
  data?: any
  lastMessage?: string
  unreadCount?: number
}