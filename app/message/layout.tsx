'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getConversations } from '@/services/chatService'
import { getUserById } from '@/services/authService'
import { Input } from '@/components/ui/input'
import { Search, ChevronLeft, MessageSquare } from 'lucide-react'
import { Conversation } from '@/types/chat'
import Image from 'next/image'

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
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const router = useRouter()
  const pathname = usePathname()

  const isInConversation =
    pathname !== '/message' && pathname.startsWith('/message/')

  const handleBack = () => {
    switch (role) {
      case 'FARMER':
        router.replace('/farmer/crops')
        break
      case 'BUYER':
        router.replace('/buyer/order')
        break
      case 'AGENT':
        router.replace('/agent/farmer')
        break
      case 'ADMIN':
        router.replace('/admin/dashboard')
        break
      default:
        router.replace('/')
    }
  }

  const getLastMessage = (conv: Conversation) => {
    if (!conv.messages || conv.messages.length === 0) return null

    const sorted = [...conv.messages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
    )

    return sorted[sorted.length - 1]
  }

  const getLastMessagePreview = (conv: Conversation) => {
    const lastMsg = getLastMessage(conv)
    if (!lastMsg) return 'No messages yet'
    return lastMsg.message
  }

  const getLastMessageTime = (conv: Conversation) => {
    const lastMsg = getLastMessage(conv)
    return lastMsg ? new Date(lastMsg.createdAt).getTime() : 0
  }

  const fetchConversations = async (userId: string | null) => {
    try {
      const data = await getConversations()

      const enrichedData = await Promise.all(
        data.map(async (conv: Conversation) => {
          const partnerId =
            String(conv.userOneId) === String(userId)
              ? conv.userTwoId
              : conv.userOneId

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

      const sorted = enrichedData.sort(
        (a, b) => getLastMessageTime(b) - getLastMessageTime(a)
      )

      setConversations(sorted)
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
          setRole(userObj.role)
        } catch (e) {
          console.error('Error parsing user:', e)
        }
      }
    }

    fetchConversations(userId)
  }, [])

  // ✅ FILTER LOGIC (optimized with useMemo)
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations

    return conversations.filter((conv) => {
      const name =
        conv.partner?.profile?.fullName?.toLowerCase() || ''
      const email =
        conv.partner?.email?.toLowerCase() || ''

      return (
        name.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase())
      )
    })
  }, [searchTerm, conversations])

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="flex flex-1 min-h-0 overflow-hidden bg-white">

          {/* Sidebar */}
          <aside
            className={`
              flex flex-col border-r bg-white
              w-full md:w-75 lg:w-85 shrink-0
              ${isInConversation ? 'hidden md:flex' : 'flex'}
            `}
          >

            {/* Header */}
            <div className="p-4 space-y-3 border-b">
              <div className="flex items-center gap-2">
                <ChevronLeft
                  className="h-5 w-5 text-emerald-600 cursor-pointer"
                  onClick={handleBack}
                />
                <h1 className="text-xl font-bold text-gray-800">
                  Messages
                </h1>
              </div>

              {/* ✅ SEARCH INPUT */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/60" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-100 rounded-2xl h-10"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-2">

              {loading ? (
                <>
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                  <ConversationSkeleton />
                </>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageSquare className="h-10 w-10 mb-3 opacity-30" />
                  <p>
                    {searchTerm
                      ? 'No matching conversations'
                      : 'No conversations yet'}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isActive = pathname.includes(conv.id)
                  const lastMsg = getLastMessage(conv)

                  const partnerName =
                    conv.partner?.profile?.fullName ||
                    conv.partner?.email ||
                    'User'

                  return (
                    <div
                      key={conv.id}
                      onClick={() => router.push(`/message/${conv.id}`)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer mx-2 rounded-2xl mb-1
                        ${isActive ? 'bg-[#effaf3]' : 'hover:bg-gray-50'}
                      `}
                    >
                      <div className="relative h-11 w-11 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        <Image
                          src={
                            conv.partner?.profile?.imageUrl ||
                            '/default-avatar.png'
                          }
                          alt="avatar"
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <span className="font-semibold truncate">
                            {partnerName}
                          </span>

                          <span className="text-[11px] text-gray-400">
                            {lastMsg
                              ? new Date(
                                  lastMsg.createdAt
                                ).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </span>
                        </div>

                        <p className="text-[13px] text-gray-500 truncate">
                          {getLastMessagePreview(conv)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </aside>

          {/* Chat area */}
          <main
            className={`
              flex-1 min-h-0 h-full bg-[#f3f4f6]
              ${isInConversation ? 'flex' : 'hidden md:flex'}
              flex-col overflow-hidden
            `}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}