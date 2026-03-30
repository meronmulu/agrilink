'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getConversations } from '@/services/chatService'
import { getUserById } from '@/services/authService'
import { Conversation } from '@/types/chat'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function MessagesLayout({ children }: any) {
  const [conversations, setConversations] = useState<any[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let userId = null
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          userId = userObj.id
          setCurrentUserId(userId)
        } catch (e) { }
      }
    }
    fetchConversations(userId)
  }, [])

  const fetchConversations = async (userId: string | null) => {
    try {
      const data = await getConversations()

      const enrichedData = await Promise.all(
        data.map(async (conv: any) => {
          const partnerId = conv.userOneId === userId ? conv.userTwoId : conv.userOneId
          if (partnerId) {
            try {
              const partner = await getUserById(partnerId)
              return { ...conv, partner }
            } catch (e) { }
          }
          return conv
        })
      )

      setConversations(enrichedData)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="grid grid-cols-4 h-screen bg-gray-50">
      {/* SIDEBAR */}
      <div className="col-span-1 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const active = pathname.includes(conv.id)

            return (
              <div
                key={conv.id}
                onClick={() => router.push(`/message/${conv.id}`)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition ${active
                  ? 'bg-emerald-50 border-l-4 border-emerald-600'
                  : 'hover:bg-gray-100'
                  }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {conv.partner ? (conv.partner.fullName || conv.partner.email)?.[0]?.toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {conv.partner ? (conv.partner.fullName || conv.partner.email) : 'User'}
                  </p>
                  <p className={`text-sm truncate ${conv.messages?.[conv.messages.length - 1]?.senderId !== currentUserId
                      ? 'font-medium text-gray-900'
                      : 'text-gray-500'
                    }`}>
                    {(() => {
                      const lastMsg = conv.messages?.[conv.messages.length - 1]
                      if (!lastMsg) return 'No messages yet'
                      const candidate = lastMsg.message ?? lastMsg.text ?? lastMsg.content
                      if (typeof candidate === 'string' || typeof candidate === 'number') return candidate
                      if (typeof candidate === 'object' && candidate !== null) {
                        return candidate.message || candidate.text || candidate.content || JSON.stringify(candidate)
                      }
                      return 'No messages yet'
                    })()}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CHAT */}
      <div className="col-span-3">{children}</div>
    </div>
  )
}

