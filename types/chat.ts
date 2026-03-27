export interface Message {
  id: string
  message: string
  senderId: string
  createdAt: string
}

export interface Conversation {
  id: string
  user?: {
    id: string
    name: string
  }
  userOneId?: string
  userTwoId?: string
  messages?: Array<{ message?: string; text?: string; content?: string; senderId?: string;[key: string]: any }>
  chatMessages?: Array<{ message?: string; text?: string; content?: string; senderId?: string;[key: string]: any }>
  data?: any
  lastMessage?: string
}