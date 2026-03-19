// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { getConversations } from '@/services/chatService'
// import { Conversation } from '@/types/chat'
// import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// export function MessagesLayout({ children }: any) {
//   const [conversations, setConversations] = useState<Conversation[]>([])
//   const router = useRouter()
//   const pathname = usePathname()

//   useEffect(() => {
//     fetchConversations()
//   }, [])

//   const fetchConversations = async () => {
//     try {
//       const data = await getConversations()
//       setConversations(data)
//     } catch (err) {
//       console.error(err)
//     }
//   }

//   return (
//     <div className="grid grid-cols-4 h-screen bg-gray-50">
//       {/* SIDEBAR */}
//       <div className="col-span-1 bg-white border-r flex flex-col">
//         <div className="p-4 border-b">
//           <h2 className="text-lg font-semibold">Messages</h2>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {conversations.map((conv) => {
//             const active = pathname.includes(conv.id)

//             return (
//               <div
//                 key={conv.id}
//                 onClick={() => router.push(`/messages/${conv.id}`)}
//                 className={`flex items-center gap-3 p-4 cursor-pointer transition ${
//                   active
//                     ? 'bg-emerald-50 border-l-4 border-emerald-600'
//                     : 'hover:bg-gray-100'
//                 }`}
//               >
//                 <Avatar>
//                   <AvatarFallback>
//                     {conv.userOneId?.[0]}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 min-w-0">
//                   <p className="font-medium truncate">
//                     {conv.userOneId} / {conv.userTwoId}
//                   </p>
//                   <p className="text-sm text-gray-500 truncate">
//                     {conv.messages?.[conv.messages.length - 1]?.message || 'No messages yet'}
//                   </p>
//                 </div>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* CHAT */}
//       <div className="col-span-3">{children}</div>
//     </div>
//   )
// }

