'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import dynamic from 'next/dynamic'

import {
  getConversations,
} from '@/services/chatService'
import { useMessage } from '@/context/MessageContext'
import { getUserById } from '@/services/authService'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  SendHorizontal,
  Paperclip,
  MoreVertical,
  ChevronLeft,
  Smile,
  CheckCheck
} from 'lucide-react'

import { Conversation, Message } from '@/types/chat'
import { User } from '@/types/auth'
import { useLanguage } from '@/context/LanguageContext'

const EmojiPicker = dynamic(
  () => import('emoji-picker-react').then(m => m.default),
  { ssr: false }
)

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL

export default function Chat() {
  const { id } = useParams()
  const router = useRouter()
  const { refreshUnread } = useMessage()
  const { t } = useLanguage()

  const conversationId = id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [receiver, setReceiver] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const currentUserId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')?.id
    : null

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // ================= SOCKET =================
  useEffect(() => {
    if (!currentUserId || !conversationId) return

    const token = localStorage.getItem('token')

    // cleanup old socket
    if (socketRef.current) {
      socketRef.current.disconnect()
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token }
    })

    socketRef.current = socket

    const handleReceiveMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return

      setMessages(prev => {
        const exists = prev.some(m => m.id === msg.id)
        if (exists) return prev

        return [...prev, msg]
      })

      if (msg.senderId !== currentUserId) {
        socket.emit('markAsRead', {
          conversationId,
          userId: currentUserId
        })

        refreshUnread()
      }
    }

    socket.on('connect', () => {
      socket.emit('join', currentUserId)
      socket.emit('joinConversation', conversationId)
    })

    socket.on('receiveMessage', handleReceiveMessage)

    return () => {
      socket.off('receiveMessage', handleReceiveMessage)
      socket.disconnect()
    }
  }, [currentUserId, conversationId, refreshUnread])

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const data: Conversation[] = await getConversations()
        const me = String(currentUserId)

        const conv = data.find(
          c => String(c.id) === String(conversationId)
        )

        if (conv) {
          const sorted = (conv.messages || []).sort(
            (a, b) =>
              new Date(a.createdAt).getTime() -
              new Date(b.createdAt).getTime()
          )

          setMessages(sorted)

          const other =
            String(conv.userOneId) === me
              ? conv.userTwo
              : conv.userOne

          setReceiver(other || null)
        } else {
          const user = await getUserById(conversationId)
          setReceiver(user)
          setMessages([])
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (conversationId && currentUserId) {
      fetchData()
    }
  }, [conversationId, currentUserId])

  // ================= AUTO SCROLL =================
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [messages])

  // ================= SEND MESSAGE =================
  const handleSend = () => {
    if (!message.trim() || !receiver || !socketRef.current) return

    const payload = {
      id: `${Date.now()}`,
      senderId: currentUserId,
      receiverId: receiver.id,
      conversationId,
      message,
      createdAt: new Date().toISOString()
    }

    // ONLY emit — DO NOT add locally
    socketRef.current.emit('sendMessage', payload)

    setMessage('')
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-[#e5e7eb]">

      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center px-3 gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push('/message')}>
          <ChevronLeft />
        </Button>

        <Avatar className="h-9 w-9 border">
          <AvatarImage src={receiver?.profile?.imageUrl || ''} />
          <AvatarFallback>
            {receiver?.profile?.fullName?.[0] || 'U'}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <h2 className="font-bold text-sm">
            {receiver?.profile?.fullName || receiver?.email}
          </h2>
        </div>

        <MoreVertical className="h-5 w-5 text-gray-400" />
      </header>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && messages.length === 0 && (
          <div className="flex justify-center">
            <div className="h-5 w-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {messages.map(msg => {
          const isMe = msg.senderId === currentUserId

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`px-3 py-2 rounded-xl ${isMe ? 'bg-green-100' : 'bg-white'}`}>
                <p>{msg.message}</p>

                <div className="text-xs text-gray-400 flex justify-end gap-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}

                  {isMe && (
                    <CheckCheck className="text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t flex items-center gap-2">

        <input
          ref={fileInputRef}
          type="file"
          hidden
        />

        <Paperclip className="cursor-pointer" />

        <input
          ref={inputRef}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full"
          placeholder={t('message_placeholder')}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />

        <Smile
          className="cursor-pointer"
          onClick={() => setShowEmoji(!showEmoji)}
        />

        {showEmoji && (
          <div className="absolute bottom-16 right-4 z-50">
            <EmojiPicker
              onEmojiClick={(e) =>
                setMessage(prev => prev + e.emoji)
              }
            />
          </div>
        )}

        <button onClick={handleSend}>
          <SendHorizontal />
        </button>
      </div>
    </div>
  )
}