import { User } from "./auth"

export interface Message {
  id: string
  message: string
  senderId: string
  createdAt: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  userOneId?: string
  userTwoId?: string
  userOne?: User
  userTwo?: User

  messages: Message[]  

  lastMessage?: string
  unreadCount?: number
  partner?: User
}