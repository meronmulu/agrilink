// 'use client'

// import { useEffect, useRef, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { getConversations, sendMessage } from '@/services/chatService'
// import { Button } from '@/components/ui/button'
// import { Send } from 'lucide-react'

// export default function ChatPage() {
//   const { id } = useParams()
//   const conversationId = id as string

//   const [messages, setMessages] = useState<any[]>([])
//   const [message, setMessage] = useState('')

//   const bottomRef = useRef<HTMLDivElement | null>(null)

// const user =
//   typeof window !== "undefined"
//     ? JSON.parse(localStorage.getItem("user") || "{}")
//     : null

// const currentUserId = user?.id
//   useEffect(() => {
//     loadConversation()
//   }, [conversationId])

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const loadConversation = async () => {
//     const data = await getConversations()

//     console.log("ALL CONVERSATIONS:", data)

//     // 🔥 flexible matching
//     const conv = data.find(
//       (c: any) =>
//         c.id === conversationId ||
//         c.conversationId === conversationId
//     )

//     if (!conv) {
//       console.log("Conversation not found")
//       setMessages([])
//       return
//     }

//     // 🔥 flexible messages extraction
//     const msgs =
//       conv.messages ||
//       conv.chatMessages ||
//       conv.data ||
//       []

//     setMessages(Array.isArray(msgs) ? msgs : [])
//   }

//   const handleSend = async () => {
//     if (!message.trim()) return

//     const payload = {
//       conversationId, // keep it (even if backend ignores)
//       message // or maybe "text" depending backend
//     }

//     const newMsg = await sendMessage(payload)

//     if (!newMsg) return

//     // 🔥 flexible append
//     setMessages((prev) => [...prev, newMsg])
//     setMessage('')
//   }

//   return (
//     <div className="flex flex-col h-full bg-white">
//       {/* HEADER */}
//       <div className="border-b p-4">
//         <h2 className="font-semibold">Chat #{conversationId}</h2>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-gray-50">
//         {messages.length === 0 ? (
//           <p className="text-center text-gray-400">No messages</p>
//         ) : (
//           messages.map((msg, i) => {
//             const text =
//               msg.message ||
//               msg.text ||
//               msg.content ||
//               "..."

//             const sender =
//               msg.senderId ||
//               msg.sender ||
//               msg.userId

//             return (
//               <div
//                 key={msg.id || i}
//                 className={`flex ${
//                   sender === currentUserId
//                     ? 'justify-end'
//                     : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`px-4 py-2 rounded-2xl max-w-xs shadow-sm text-sm ${
//                     sender === currentUserId
//                       ? 'bg-emerald-600 text-white'
//                       : 'bg-white border'
//                   }`}
//                 >
//                   {text}
//                 </div>
//               </div>
//             )
//           })
//         )}
//         <div ref={bottomRef} />
//       </div>

//       {/* INPUT */}
//       <div className="border-t p-4 flex gap-2">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 border rounded-full px-4 py-2"
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />

//         <Button onClick={handleSend}>
//           <Send size={18} />
//         </Button>
//       </div>
//     </div>
//   )
// }