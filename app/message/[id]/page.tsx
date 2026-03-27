'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getConversations, sendMessage } from '@/services/chatService'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'
import { getUserById } from '@/services/authService'

export default function ChatPage() {
  const { id } = useParams()
  const conversationId = id as string

  const [messages, setMessages] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [receiver, setReceiver] = useState<any>(null)
  const [currentConv, setCurrentConv] = useState<any>(null)

  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          setCurrentUserId(userObj.id)
        } catch (e) { }
      }
    }
  }, [])
  useEffect(() => {
    loadConversation()
  }, [conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadConversation = async () => {
    // Try to identify if the ID in the URL is a user ID
    try {
      const user = await getUserById(conversationId)
      if (user) {
        setReceiver(user)
      }
    } catch (e) {
      console.log("URL ID is not a direct User ID.", e)
    }

    const data = await getConversations()

    console.log("ALL CONVERSATIONS:", data)

    // 🔥 flexible matching
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
        } catch (e) { }
      }
    }

    if (!conv) {
      console.log("Conversation not found")
      setMessages([])
      return
    }

    setCurrentConv(conv)

    // 🔥 flexible messages extraction
    const msgs =
      conv.messages ||
      conv.chatMessages ||
      conv.data ||
      []

    setMessages(Array.isArray(msgs) ? msgs : [])
  }

  const handleSend = async () => {
    if (!message.trim()) return

    const payload: any = {
      receiverId: receiver?.id || conversationId,
      message
    }

    if (currentConv && currentConv.id) {
      payload.conversationId = currentConv.id
    }

    try {
      const newMsg = await sendMessage(payload)

      if (!newMsg) return

      // 🔥 flexible append
      setMessages((prev) => [...prev, newMsg])
      setMessage('')
    } catch (e: any) {
      console.log("SEND ERROR IN COMPONENT", e)
      console.log("BACKEND PAYLOAD:", payload)
      import('sonner').then(({ toast }) => {
        toast.error(e?.response?.data?.message || "Failed to send message")
      })
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* HEADER */}
      <div className="border-b p-4">
        <h2 className="font-semibold text-lg">
          {receiver ? (receiver.fullName || receiver.email || 'User') : `Chat #${conversationId}`}
        </h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">No messages</p>
        ) : (
          messages.map((msg, i) => {
            const text =
              msg.message ||
              msg.text ||
              msg.content ||
              "..."

            const sender =
              msg.senderId ||
              msg.sender ||
              msg.userId

            return (
              <div
                key={msg.id || i}
                className={`flex ${sender === currentUserId
                  ? 'justify-end'
                  : 'justify-start'
                  }`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm text-sm ${sender === currentUserId
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white border'
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

      {/* INPUT */}
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