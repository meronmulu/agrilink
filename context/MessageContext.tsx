'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'
import { getUnreadMessageCount } from '@/services/chatService'
import { useAuth } from './AuthContext'

interface MessageContextType {
  unreadCount: number
  refreshUnread: () => Promise<void>
  markAsRead: () => void
}

const MessageContext = createContext<MessageContextType | null>(null)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnread = async () => {
    if (user?.id) {
      try {
        const count = await getUnreadMessageCount(user.id)
        setUnreadCount(count)
      } catch (error) {
        console.error('Error fetching unread count:', error)
      }
    }
  }

  // ✅ FIXED: matches interface
  const markAsRead = () => {
    setUnreadCount(0)
  }

  useEffect(() => {
    refreshUnread()

    const interval = setInterval(() => {
      refreshUnread()
    }, 30000)

    return () => clearInterval(interval)
  }, [user?.id])

  return (
    <MessageContext.Provider
      value={{ unreadCount, refreshUnread, markAsRead }}
    >
      {children}
    </MessageContext.Provider>
  )
}

export const useMessage = () => {
  const context = useContext(MessageContext)
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider')
  }
  return context
}