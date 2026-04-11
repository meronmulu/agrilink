'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getConversations } from '@/services/chatService'
import { getUserById } from '@/services/authService'
import { Input } from '@/components/ui/input'
import { Search, MessageSquare } from 'lucide-react'
import { Conversation } from '@/types/chat'
import Image from 'next/image'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'

function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 mx-2 rounded-2xl animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
      </div>
    </div>
  )
}

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const isInConversation = pathname !== '/message' && pathname.startsWith('/message/')

  const fetchConversations = async (userId: string | null) => {
    try {
      const data = await getConversations()
      const enrichedData = await Promise.all(
        data.map(async (conv: Conversation) => {
          const partnerId = String(conv.userOneId) === String(userId) ? conv.userTwoId : conv.userOneId
          if (partnerId) {
            try {
              const partner = await getUserById(partnerId)
              return { ...conv, partner }
            } catch (e) {
              console.error('Error fetching partner:', e)
            }
          }
          return conv
        })
      )
      setConversations(enrichedData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let userId = null
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          userId = userObj.id
          setCurrentUserId(userId)
        } catch (e) {
          console.error('Error parsing user from localStorage:', e)
        }
      }
    }
    fetchConversations(userId)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center h-16 shrink-0 border-b border-gray-200 bg-white">
        <div className="flex-1">
          <Header />
        </div>
      </div>

      {/* Body: Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* App Sidebar (hidden on mobile) */}
        <Sidebar />

        {/* Messages Panel */}
        <div className="flex flex-1 overflow-hidden bg-white">

          {/* Conversation List Sidebar */}
          <aside
            className={`
              flex flex-col border-r bg-white
              w-full md:w-[300px] lg:w-[340px] shrink-0
              ${isInConversation ? 'hidden md:flex' : 'flex'}
            `}
          >
            {/* Search Header */}
            <div className="p-4 space-y-3 border-b">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-emerald-600" />
                <h1 className="text-xl font-bold tracking-tight text-gray-800">Messages</h1>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/60" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-10 bg-gray-50 border-gray-100 rounded-2xl h-10 focus-visible:ring-2 focus-visible:ring-emerald-500/30"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
              {loading ? (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                  <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = pathname.includes(conv.id)
                  const lastMsg = conv.messages?.[conv.messages.length - 1]
                  const partnerName =
                    conv.partner?.profile?.fullName ||
                    conv.partner?.email ||
                    'User'

                  return (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/message/${conv.id}`)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all relative mx-2 rounded-2xl mb-1
                        ${isActive ? 'bg-[#effaf3]' : 'hover:bg-gray-50 active:bg-gray-100'}
                      `}
                    >
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={conv.partner?.profile?.imageUrl || '/default-avatar.png'}
                          alt={conv.partner?.profile?.fullName || 'User'}
                          fill
                          className="rounded-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <span className={`font-semibold text-[15px] truncate ${isActive ? 'text-emerald-800' : 'text-gray-900'}`}>
                            {partnerName}
                          </span>
                          <span className={`text-[11px] font-medium shrink-0 ml-1 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                            {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p className={`text-[13px] truncate leading-tight ${isActive ? 'text-emerald-700/80' : 'text-gray-500'}`}>
                          {lastMsg?.message || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </aside>

          {/* Main Chat Area */}
          <main className={`
            flex-1 h-full relative bg-[#f3f4f6]
            ${isInConversation ? 'flex' : 'hidden md:flex'}
            flex-col
          `}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}