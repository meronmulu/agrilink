'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { getConversations } from '@/services/chatService'

// shadcn components
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'

// Icons
import {
  SendHorizontal,
  Paperclip,
  MoreVertical,
  ChevronLeft,
  Smile,
  CheckCheck,
  Loader2
} from 'lucide-react'

import { Conversation, Message } from '@/types/chat'
import { User } from '@/types/auth'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-full">
      {/* Header skeleton */}
      <header className="h-14 bg-white border-b flex items-center px-4 gap-3">
        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-32 animate-pulse" />
          <div className="h-2 bg-gray-100 rounded w-16 animate-pulse" />
        </div>
      </header>

      {/* Messages skeleton */}
      <div className="flex-1 p-4 space-y-3 bg-[#e5e7eb]">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`h-10 rounded-xl animate-pulse ${i % 2 === 0 ? 'bg-white w-48' : 'bg-emerald-100 w-36'}`} />
          </div>
        ))}
      </div>

      {/* Input skeleton */}
      <div className="p-4 bg-white border-t flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 h-10 bg-gray-100 rounded-full animate-pulse" />
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        <div className="h-5 w-5 bg-emerald-100 rounded animate-pulse" />
      </div>
    </div>
  )
}

export default function TelegramChat() {
  const { id } = useParams()
  const router = useRouter()
  const conversationId = id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [receiver, setReceiver] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr).id : null
  })

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

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
          const updatedMsg = msg.senderId !== currentUserId ? { ...msg, isRead: true } : msg
          return [...prev, updatedMsg]
        })
        if (msg.senderId !== currentUserId) {
          socket.emit('markAsRead', { conversationId, userId: currentUserId })
        }
      }
    })

    //  RECEIVE READ STATUS
    socket.on('messagesRead', ({ conversationId: convId, userId }) => {
      if (convId === conversationId) {
        setMessages(prev => prev.map(m => m.senderId === userId ? { ...m, isRead: true } : m))
      }
    })

    return () => { socket.disconnect() }
  }, [currentUserId, conversationId])

  //  LOAD DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data: Conversation[] = await getConversations()
        const conv = data.find(c => c.id === conversationId)

        if (conv && currentUserId) {
          const me = currentUserId
          const other = conv.userOneId === me ? conv.userTwo : conv.userOne
          setReceiver(other || null)

          const updatedMessages = (conv.messages ?? []).map((m: Message) =>
            m.senderId !== me ? { ...m, isRead: true } : m
          )
          setMessages(updatedMessages)

          socketRef.current?.emit('markAsRead', { conversationId, userId: me })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
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
    inputRef.current?.focus()
  }

  if (loading) return <ChatSkeleton />

  return (
    <div className="flex flex-col h-full bg-[#e5e7eb]">

      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center px-3 gap-3 shrink-0 shadow-sm">
        {/* Back button: visible on mobile to return to conversation list */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => router.push('/message')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-9 w-9 border shrink-0">
          <AvatarImage src={receiver?.profile?.imageUrl || '/default-avatar.png'} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-semibold text-sm">
            {receiver?.profile?.fullName?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h2 className="font-bold text-sm truncate">
            {receiver?.profile?.fullName || receiver?.email || 'Unknown'}
          </h2>
          <span className="text-xs text-emerald-500">online</span>
        </div>

        <MoreVertical className="h-5 w-5 text-gray-400 shrink-0" />
      </header>

      {/* MESSAGES */}
      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm">No messages yet. Say hello! 👋</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.senderId === currentUserId
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] sm:max-w-[65%] px-3 py-2 shadow-sm
                  ${isMe
                    ? 'bg-[#e7fecb] rounded-l-2xl rounded-tr-2xl'
                    : 'bg-white rounded-r-2xl rounded-tl-2xl'}
                `}>
                  <p className="text-sm break-words">{msg.message}</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <span className="text-[10px] text-gray-400">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {isMe && (
                      <CheckCheck
                        className={`h-3 w-3 ${msg.isRead ? 'text-emerald-500' : 'text-gray-400'}`}
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
      <div className="p-3 bg-white border-t flex items-center gap-2 shrink-0">
        <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          ref={inputRef}
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400 transition min-w-0"
          placeholder="Message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />

        <button className="text-gray-400 hover:text-gray-600 transition shrink-0">
          <Smile className="h-5 w-5" />
        </button>

        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className="shrink-0 h-9 w-9 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center transition"
        >
          <SendHorizontal className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  )
}