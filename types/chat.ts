import { User } from "./auth"
import { Profile } from "./profile"

export interface Message {
  id: string
  message: string
  senderId: string
  createdAt: string
  isRead?: boolean
}

export interface Conversation {
  id: string
  user?: User
  userOneId?: string
  userTwoId?: string
  messages?: Message[]
  chatMessages?: Message[]
  data?: Message[]
  lastMessage?: string
  unreadCount?: number
  partner?: User
}