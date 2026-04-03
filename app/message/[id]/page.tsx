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
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr).id : null
  })
  
  const socketRef = useRef<Socket | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  // Initialize Socket.IO
  useEffect(() => {
    if (!currentUserId) return
    const socket = io(SOCKET_URL, { transports: ['websocket'] })
    socketRef.current = socket
    
    socket.on('connect', () => {
      socket.emit('join', currentUserId)
      if (conversationId) socket.emit('joinConversation', conversationId)
    })

    const handleNewMsg = (msg: Message & { conversationId: string }) => {
      if (msg.conversationId === conversationId) {
        setMessages(prev => {
          const exists = prev.some(m => m.id === msg.id)
          return exists ? prev : [...prev, msg]
        })
      }
    }

    socket.on('receiveMessage', handleNewMsg)
    return () => { socket.disconnect() }
  }, [currentUserId, conversationId])

  // Load conversations and current conversation messages
  useEffect(() => {
    const fetchData = async () => {
      const data = await getConversations()
      setConversations(data)
      const conv = data.find(c => c.id === conversationId)
      if (conv && currentUserId) {
        const me = currentUserId
        const other = conv.userOneId === me ? conv.userTwo : conv.userOne
        setReceiver(other || null)
        setMessages(conv.messages || [])
      }
    }
    fetchData()
  }, [conversationId, currentUserId])

  // Scroll to bottom when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'auto' })
  }, [messages])

  const handleSend = () => {
    if (!message.trim() || !currentUserId || !receiver) return

    const payload: Message & { conversationId: string; receiverId: string } = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: currentUserId,
      message,
      conversationId,
      receiverId: receiver.id,
      createdAt: new Date().toISOString(),
    }

    setMessages(prev => [...prev, payload])
    socketRef.current?.emit('sendMessage', payload)
    setMessage('')
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden text-black">
      {/* MAIN CHAT AREA */}
      <main className={`flex-1 flex flex-col bg-[#e5e7eb] ${!conversationId ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <header className="h-15 bg-white border-b flex items-center px-4 gap-3 z-10 shrink-0">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push('/message')}>
            <ChevronLeft />
          </Button>
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-gray-50 text-gray-400 font-light">
              {receiver?.profile?.fullName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 leading-tight">
            <h2 className="font-bold text-[15px] truncate">
              {receiver?.profile?.fullName || receiver?.email || 'User'}
            </h2>
            <span className="text-[11px] text-blue-500">online</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 md:p-6">
          <div className="flex flex-col space-y-3">
            {messages.map((msg) => {
              const isMe = msg.senderId === currentUserId
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`
                    relative px-3 py-1.5 shadow-sm min-w-20
                    ${isMe 
                      ? 'bg-[#e7fecb] text-black rounded-l-xl rounded-tr-xl' 
                      : 'bg-white text-black rounded-r-xl rounded-tl-xl'}
                  `}>
                    <div className="flex flex-col">
                      <p className="text-[14px] leading-snug pr-14">{msg.message}</p>
                      <div className="flex items-center gap-1 self-end mt-0.5">
                        <span className="text-[10px] text-gray-400">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Input Bar */}
        <div className="px-4 py-4 md:px-20 lg:px-40 shrink-0 bg-transparent">
          <div className="bg-white rounded-full flex items-center px-4 py-1.5 shadow-sm border border-gray-200">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-transparent">
              <Paperclip className="h-5 w-5" />
            </Button>
            <input
              placeholder="Message"
              className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-[15px] outline-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button variant="ghost" size="icon" className="text-gray-400 hover:bg-transparent">
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              onClick={handleSend}
              className="text-blue-500 hover:bg-transparent"
            >
              <SendHorizontal className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}