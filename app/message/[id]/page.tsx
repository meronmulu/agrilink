'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import dynamic from 'next/dynamic'

import { getConversations, sendMessage as sendRest } from '@/services/chatService'
import { useMessage } from '@/context/MessageContext'

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

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'

export default function TelegramChat() {
  const { id } = useParams()
  const router = useRouter()
  const { refreshUnread } = useMessage()

  const conversationId = id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [receiver, setReceiver] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr).id : null
  })

  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // SOCKET
  useEffect(() => {
    if (!currentUserId) return

    const token = localStorage.getItem('token')

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      auth: { token }
    })

    socketRef.current = socket

    socket.on('connect', () => {
      socket.emit('join', currentUserId)
      if (conversationId) socket.emit('joinConversation', conversationId)
    })

    socket.on('receiveMessage', (msg: any) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id)
          if (exists) return prev

          const updated =
            msg.senderId !== currentUserId
              ? { ...msg, isRead: true }
              : msg

          return [...prev, updated]
        })

        if (msg.senderId !== currentUserId) {
          socket.emit('markAsRead', {
            conversationId,
            userId: currentUserId
          })
          refreshUnread()
        }
      }
    })

    socket.on('messagesRead', ({ conversationId: convId, userId }) => {
      if (convId === conversationId) {
        setMessages(prev =>
          prev.map(m =>
            m.senderId === userId ? { ...m, isRead: true } : m
          )
        )
      }
    })

    return () => socket.disconnect()
  }, [currentUserId, conversationId])

  // LOAD DATA
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        const data: Conversation[] = await getConversations()

        let conv = data.find(c => String(c.id) === String(conversationId))

        if (!conv && currentUserId) {
          const me = String(currentUserId)
          conv = data.find(c =>
            (String(c.userOneId) === me &&
              String(c.userTwoId) === String(conversationId)) ||
            (String(c.userTwoId) === me &&
              String(c.userOneId) === String(conversationId))
          )
        }

        if (currentUserId && conv) {
          const me = String(currentUserId)

          const other =
            String(conv.userOneId) === me ? conv.userTwo : conv.userOne

          setReceiver(other || null)

          const msgList =
            conv.messages || conv.chatMessages || conv.data || []

          const updatedMessages = msgList.map((m: Message) =>
            String(m.senderId) !== me ? { ...m, isRead: true } : m
          )

          setMessages(updatedMessages)

          socketRef.current?.emit('markAsRead', {
            conversationId: conv.id,
            userId: me
          })

          setTimeout(() => refreshUnread(), 300)
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [conversationId, currentUserId])

  // AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // SEND MESSAGE
  const handleSend = async () => {
    if ((!message.trim() && !attachment) || !currentUserId || !receiver)
      return

    const tempId = `${Date.now()}`

    const payload: any = {
      id: tempId,
      senderId: currentUserId,
      message,
      conversationId: messages.length > 0 ? conversationId : undefined,
      receiverId: receiver.id
    }

    // optimistic UI
    setMessages(prev => [...prev, payload])

    const currentMsg = message
    setMessage('')
    const currentAttachment = attachment
    setAttachment(null)
    setShowEmoji(false)

    try {
      let finalData: any

      if (currentAttachment) {
        finalData = new FormData()
        finalData.append('senderId', payload.senderId)
        finalData.append('message', currentMsg || 'Attachment')
        if (payload.conversationId)
          finalData.append('conversationId', payload.conversationId)
        finalData.append('receiverId', payload.receiverId)
        finalData.append('file', currentAttachment)
      } else {
        finalData = payload
      }

      const res = await sendRest(finalData)

      if (res?.conversationId && res.conversationId !== conversationId) {
        router.replace(`/message/${res.conversationId}`)
      }
    } catch (error) {
      console.error('Send error:', error)
    }

    inputRef.current?.focus()
  }

  if (loading) return <div className="p-4">Loading...</div>

  return (
    <div className="flex flex-col h-full bg-[#e5e7eb]">

      {/* HEADER */}
      <header className="h-14 bg-white border-b flex items-center px-3 gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push('/message')}
        >
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
        {messages.map(msg => {
          const isMe = msg.senderId === currentUserId

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-3 py-2 rounded-xl ${
                  isMe ? 'bg-green-100' : 'bg-white'
                }`}
              >
                <p>{msg.message}</p>

                <div className="text-xs text-gray-400 flex justify-end gap-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}

                  {isMe && (
                    <CheckCheck
                      className={
                        msg.isRead ? 'text-green-500' : 'text-gray-400'
                      }
                    />
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
          onChange={e =>
            e.target.files && setAttachment(e.target.files[0])
          }
        />

        <Paperclip
          className="cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        />

        <input
          ref={inputRef}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full"
          placeholder="Message..."
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />

        <Smile
          className="cursor-pointer"
          onClick={() => setShowEmoji(!showEmoji)}
        />

        {showEmoji && (
          <div className="absolute bottom-16 right-4">
            <EmojiPicker
              onEmojiClick={(e: any) =>
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