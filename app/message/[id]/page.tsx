'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { getConversations } from '@/services/chatService'

// shadcn components
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

// Icons
import { 
  SendHorizontal, 
  Paperclip, 
  MoreVertical, 
  Search, 
  ChevronLeft, 
  Smile, 
  CheckCheck 
} from 'lucide-react'

import { Conversation, Message } from '@/types/chat'
import { User } from '@/types/auth'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'

export default function TelegramChat() {
  const { id } = useParams()
  const router = useRouter()
  const conversationId = id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [receiver, setReceiver] = useState<User | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr).id : null
  })

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  //  SOCKET INIT
  useEffect(() => {
    if (!currentUserId) return

    const socket = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', currentUserId)
      if (conversationId) socket.emit('joinConversation', conversationId)
    })

    //  RECEIVE MESSAGE
    socket.on('receiveMessage', (msg: Message & { conversationId: string }) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id)
          if (exists) return prev

          // mark as read instantly if open
          const updatedMsg =
            msg.senderId !== currentUserId
              ? { ...msg, isRead: true }
              : msg

          return [...prev, updatedMsg]
        })

        // notify backend read
        if (msg.senderId !== currentUserId) {
          socket.emit('markAsRead', {
            conversationId,
            userId: currentUserId
          })
        }
      }
    })

    //  RECEIVE READ STATUS
    socket.on('messagesRead', ({ conversationId: convId, userId }) => {
      if (convId === conversationId) {
        setMessages(prev =>
          prev.map(m =>
            m.senderId === userId ? { ...m, isRead: true } : m
          )
        )
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [currentUserId, conversationId])

  //  LOAD DATA
  useEffect(() => {
    const fetchData = async () => {
      const data = await getConversations()
      const conv = data.find(c => c.id === conversationId)

      if (conv && currentUserId) {
        const me = currentUserId
        const other = conv.userOneId === me ? conv.userTwo : conv.userOne

        setReceiver(other || null)

        // mark messages read locally
        const updatedMessages = (conv.messages || []).map((m: { senderId: string }) =>
          m.senderId !== me ? { ...m, isRead: true } : m
        )

        setMessages(updatedMessages)

        // notify backend
        socketRef.current?.emit('markAsRead', {
          conversationId,
          userId: me
        })
      }
    }

    fetchData()
  }, [conversationId, currentUserId])

 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  //  SEND MESSAGE
  const handleSend = () => {
    if (!message.trim() || !currentUserId || !receiver) return

    const payload: Message & { conversationId: string; receiverId: string } = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: currentUserId,
      message,
      conversationId,
      receiverId: receiver.id,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    setMessages(prev => [...prev, payload])
    socketRef.current?.emit('sendMessage', payload)
    setMessage('')
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-black">
      <main className="flex-1 flex flex-col bg-[#e5e7eb]">

        {/* HEADER */}
        <header className="h-15 bg-white border-b flex items-center px-4 gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/message')}>
            <ChevronLeft />
          </Button>

          <Avatar className="h-10 w-10 border">
            <AvatarFallback>
              {receiver?.profile?.fullName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h2 className="font-bold text-sm">
              {receiver?.profile?.fullName || receiver?.email}
            </h2>
            <span className="text-xs text-emerald-500">online</span>
          </div>

          <Search className="h-5 w-5 text-gray-400" />
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </header>

        {/* MESSAGES */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map(msg => {
              const isMe = msg.senderId === currentUserId

              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-1.5 shadow-sm
                    ${isMe 
                      ? 'bg-[#e7fecb] rounded-l-xl rounded-tr-xl' 
                      : 'bg-white rounded-r-xl rounded-tl-xl'}
                  `}>
                    <p className="text-sm pr-10">{msg.message}</p>

                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {isMe && (
                        <CheckCheck
                          className={`h-3 w-3 ${
                            msg.isRead ? 'text-emerald-500' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* INPUT */}
        <div className="p-4 bg-white border-t flex items-center gap-2">
          <Paperclip className="text-gray-400" />

          <input
            className="flex-1 outline-none"
            placeholder="Message"
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />

          <Smile className="text-gray-400" />

          <SendHorizontal
            onClick={handleSend}
            className="text-emerald-500 cursor-pointer"
          />
        </div>

      </main>
    </div>
  )
}