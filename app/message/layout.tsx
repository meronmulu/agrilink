'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getConversations } from '@/services/chatService'
import { getUserById } from '@/services/authService'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Search, Menu, Plus } from 'lucide-react'
import { Conversation } from '@/types/chat'

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  

  const fetchConversations = async (userId: string | null) => {
    try {
      const data = await getConversations()

      const enrichedData = await Promise.all(
        data.map(async (conv: Conversation) => {
          // Identify the other user in the conversation
          const partnerId = String(conv.userOneId) === String(userId) ? conv.userTwoId : conv.userOneId
          
          if (partnerId) {
            try {
              const partner = await getUserById(partnerId)
              console.log("Partner Data:", partner) 
              return { ...conv, partner }
            } catch (e) {
              console.error("Error fetching partner:", e)
            }
          }
          return conv
        })
      )

      setConversations(enrichedData)
    } catch (err) {
      console.error(err)
    }
  }
  useEffect(() => {
    let userId = null
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user")
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr)
          userId = userObj.id
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setCurrentUserId(userId)
        } catch (e) { }
      }
    }
    fetchConversations(userId)
  }, [])

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* SIDEBAR */}
      <aside className={`flex flex-col border-r w-full md:w-[320px] lg:w-95 shrink-0 ${pathname !== '/message' && !pathname.startsWith('/message/') ? 'flex' : 'hidden md:flex'}`}>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Menu className="text-emerald-600 h-6 w-6 cursor-pointer" />
              <h1 className="text-xl font-bold tracking-tight text-gray-800">Messages</h1>
            </div>
            <button className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors">
               <Plus size={20} />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/60" />
            <Input 
              placeholder="Search" 
              className="pl-10 bg-gray-50 border-gray-100 rounded-2xl h-10 focus-visible:ring-2 focus-visible:ring-emerald-500/30" 
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {conversations.map((conv) => {
            const isActive = pathname.includes(conv.id)
            const lastMsg = conv.messages?.[conv.messages.length - 1]
            
            // ✅ FIX: Check profile.fullName first, then fullName, then email
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
                <Avatar className="h-12 w-12 border border-emerald-100 shrink-0 shadow-sm">
                  <AvatarFallback className={`${isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'} font-semibold uppercase`}>
                    {partnerName[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`font-bold text-[15px] truncate ${isActive ? 'text-emerald-800' : 'text-gray-900'}`}>
                      {partnerName}
                    </span>
                    <span className={`text-[11px] font-medium shrink-0 ${isActive ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  
                  <p className={`text-[13.5px] truncate leading-tight ${isActive ? 'text-emerald-700/80' : 'text-gray-500'}`}>
                    {lastMsg?.message || 'No messages yet'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full relative bg-[#f3f4f6]">
        {children}
      </main>
    </div>
  )
}