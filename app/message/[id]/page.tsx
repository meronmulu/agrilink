'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { getConversations } from '@/services/chatService'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { getUserById } from '@/services/authService'

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const conversationId = id as string

  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [receiver, setReceiver] = useState<any>(null)
  const [currentConv, setCurrentConv] = useState<any>(null)

  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          setCurrentUserId(userObj.id)
        } catch (e) {
          console.warn('Invalid user object in localStorage', e)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (!currentUserId) return

    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    })

    socketRef.current = socket

    const appendIncomingMessage = (msg: any) => {
      if (!msg) return

      // conversation-based guard or one-on-one by sender/receiver
      if (msg.conversationId && conversationId && msg.conversationId !== conversationId) return
      if (!msg.conversationId && receiver) {
        const validOneOnOne =
          (msg.senderId === receiver?.id && msg.receiverId === currentUserId) ||
          (msg.senderId === currentUserId && msg.receiverId === receiver?.id)
        if (!validOneOnOne) return
      }

      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m.id && msg.id && m.id === msg.id)
        if (alreadyExists) return prev
        return [...prev, msg]
      })
    }

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)

      if (currentUserId) {
        socket.emit('join', currentUserId)
        console.log('Joined user room', currentUserId)
      }

      if (conversationId) {
        socket.emit('joinRoom', conversationId)
        socket.emit('joinConversation', conversationId)
        console.log('Joined conversation room', conversationId)
      }
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
      setIsConnected(false)
    })

    socket.on('receiveMessage', appendIncomingMessage)
    socket.on('message', appendIncomingMessage)
    socket.on('chatMessage', appendIncomingMessage)
    socket.on('newMessage', appendIncomingMessage)

    return () => {
      socket.off('receiveMessage', appendIncomingMessage)
      socket.off('message', appendIncomingMessage)
      socket.off('chatMessage', appendIncomingMessage)
      socket.off('newMessage', appendIncomingMessage)
      socket.disconnect()
      socketRef.current = null
    }
  }, [currentUserId, conversationId, receiver])

  useEffect(() => {
    loadConversation()
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversation = async () => {
    try {
      const user = await getUserById(conversationId)
      if (user) setReceiver(user)
    } catch (e) {
      console.log('URL ID is not a direct User ID.', e)
    }

    const data = await getConversations()

    console.log('ALL CONVERSATIONS:', data)

    const conv = data.find(
      (c: any) =>
        c.id === conversationId ||
        c.conversationId === conversationId ||
        c.userOneId === conversationId ||
        c.userTwoId === conversationId
    )

    if (conv && currentUserId) {
      const otherId = conv.userOneId === currentUserId ? conv.userTwoId : conv.userOneId
      if (otherId && otherId !== conversationId) {
        try {
          const otherUser = await getUserById(otherId)
          if (otherUser) setReceiver(otherUser)
        } catch (e) {
          console.warn('Failed to load other user', e)
        }
      }
    }

    if (!conv) {
      console.log('Conversation not found')
      setMessages([])
      return
    }

    setCurrentConv(conv)
    const msgs = conv.messages || conv.chatMessages || conv.data || []
    setMessages(Array.isArray(msgs) ? msgs : [])
  }

  const handleSend = async () => {
    if (!message.trim() || !currentUserId) return

    const payload: any = {
      senderId: currentUserId,
      receiverId: receiver?.id || conversationId,
      message,
      conversationId: currentConv?.id || conversationId,
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, payload])
    setMessage('')

    if (!socketRef.current || !isConnected) {
      console.warn('Socket is not connected. Message queued but not sent yet.')
      return
    }

    socketRef.current.emit('sendMessage', payload)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b p-4">
        <h2 className="font-semibold text-lg">
          {receiver ? receiver.fullName || receiver.email || 'User' : `Chat #${conversationId}`}
        </h2>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages</p>
        ) : (
          messages.map((msg, i) => {
            const rawText = msg.message ?? msg.text ?? msg.content ?? null
            let text = '...'

            if (rawText !== null && rawText !== undefined) {
              if (typeof rawText === 'string' || typeof rawText === 'number') {
                text = `${rawText}`
              } else if (typeof rawText === 'object') {
                text = rawText.message || rawText.text || rawText.content || JSON.stringify(rawText)
              } else {
                text = String(rawText)
              }
            }

            const sender = msg.senderId || (typeof msg.sender === 'string' ? msg.sender : msg.sender?.id) || msg.userId

            return (
              <div
                key={msg.id || i}
                className={`flex ${sender === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm text-sm ${
                    sender === currentUserId ? 'bg-emerald-600 text-white' : 'bg-white border'
                  }`}
                >
                  {text}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t p-4 flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <Button onClick={handleSend}>
          <Send size={18} />
        </Button>
      </div>
    </div>
  )
}