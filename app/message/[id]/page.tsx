'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { getConversations } from '@/services/chatService'
import dynamic from 'next/dynamic'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })
import { useMessage } from '@/context/MessageContext'

// shadcn components
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
  const { refreshUnread } = useMessage()
  const conversationId = id as string

  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  //  SOCKET INIT
  useEffect(() => {
    if (!currentUserId) return

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const socket = io(SOCKET_URL, { 
      transports: ['websocket'],
      auth: { token }
    })
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
          refreshUnread()
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
        
        // 1. Try to find conversation by ID
        let conv = data.find(c => String(c.id) === String(conversationId))
        
        // 2. If not found, check if conversationId is actually a partnerId (User ID)
        if (!conv && currentUserId) {
          const me = String(currentUserId)
          conv = data.find(c => 
            (String(c.userOneId) === me && String(c.userTwoId) === String(conversationId)) ||
            (String(c.userTwoId) === me && String(c.userOneId) === String(conversationId))
          )
        }

        if (currentUserId) {
          const me = String(currentUserId)
          
          if (conv) {
            // Existing conversation found
            const other = String(conv.userOneId) === me ? conv.userTwo : conv.userOne
            setReceiver(other || null)

            const msgList = conv.messages || conv.chatMessages || conv.data || []
            const updatedMessages = msgList.map((m: Message) =>
              String(m.senderId) !== me ? { ...m, isRead: true } : m
            )
            setMessages(updatedMessages)
            socketRef.current?.emit('markAsRead', { conversationId: conv.id, userId: me })
            setTimeout(() => refreshUnread(), 500) // allow backend time to update
          } else {
            // No conversation found, but we have an ID (likely a Farmer ID from product page)
            try {
              const { getUserById } = await import('@/services/authService')
              const partner = await getUserById(conversationId)
              setReceiver(partner || null)
              setMessages([])
            } catch (e) {
              console.error("Failed to fetch partner info:", e)
            }
          }
        }
      } catch (err) {
        console.error("Fetch data error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [conversationId, currentUserId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  //  SEND MESSAGE
  const handleSend = async () => {
    if ((!message.trim() && !attachment) || !currentUserId || !receiver) return

    const tempId = `${Date.now()}-${Math.random()}`;
    const payload: any = {
      id: tempId,
      senderId: currentUserId,
      message,
      conversationId: messages.length > 0 ? conversationId : "", // If new conversation, ID might be User ID
      receiverId: receiver.id,
      createdAt: new Date().toISOString(),
      isRead: false
    }

    // Optimistically add message
    setMessages(prev => [...prev, payload]);
    const currentMsg = message;
    setMessage('');

    const currentAttachment = attachment;
    setAttachment(null);
    setShowEmoji(false);
    
    try {
      const { sendMessage: sendRest } = await import('@/services/chatService');
      
      let finalData;
      if (currentAttachment) {
        finalData = new FormData();
        finalData.append("senderId", payload.senderId);
        finalData.append("message", currentMsg || "Sent an attachment");
        finalData.append("conversationId", payload.conversationId);
        finalData.append("receiverId", payload.receiverId);
        finalData.append("file", currentAttachment); 
      } else {
        finalData = payload;
      }

      const res = await sendRest(finalData);
      
      // If this was a first message, backend should return the new conversation ID
      if (res?.conversationId && res.conversationId !== conversationId) {
        router.replace(`/message/${res.conversationId}`)
      }
    } catch (error) {
      console.error("Failed to send message via REST:", error);
    }
    
    inputRef.current?.focus()
  }

  if (loading) return <ChatSkeleton />

  return (
    <div className="flex flex-col h-full bg-[#e5e7eb] overflow-hidden">

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
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col" onClick={() => setShowEmoji(false)}>
        <div className="flex-1 min-h-[1rem]"></div>
        <div className="space-y-3 max-w-3xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p className="text-sm">No messages yet. Say hello! 👋</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.senderId === currentUserId
            const senderName = isMe ? 'You' : (receiver?.profile?.fullName || receiver?.email || 'User')
            
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <span className="text-[11px] text-gray-500 mb-1 ml-2 mr-2 font-medium">{senderName}</span>
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
          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* INPUT */}
      <div className="p-3 bg-white border-t flex flex-col gap-2 shrink-0">
        
        {attachment && (
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit text-sm text-emerald-700">
            <span className="truncate max-w-[200px]">{attachment.name}</span>
            <button onClick={() => setAttachment(null)} className="text-red-500 hover:text-red-700 font-bold ml-2">×</button>
          </div>
        )}

        <div className="flex items-center gap-2 w-full">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAttachment(e.target.files[0])
              }
            }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className={`transition shrink-0 ${attachment ? 'text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
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

          <div className="relative">
            <button 
              onClick={() => setShowEmoji(!showEmoji)}
              className="text-gray-400 hover:text-gray-600 transition shrink-0 flex items-center justify-center p-1"
            >
              <Smile className="h-5 w-5" />
            </button>
            {showEmoji && (
              <div className="absolute bottom-12 right-0 z-50 shadow-xl rounded-xl">
                <EmojiPicker onEmojiClick={(emojiData: any) => setMessage(prev => prev + emojiData.emoji)} />
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!message.trim() && !attachment}
            className="shrink-0 h-9 w-9 rounded-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center transition"
          >
            <SendHorizontal className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}