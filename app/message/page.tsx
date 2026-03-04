'use client'

import { useState } from 'react'
import { Search, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

interface Conversation {
  id: number
  name: string
  status: string
  messages: { type: 'sent' | 'received'; text: string }[]
}

export default function MessagesPage() {
  const [message, setMessage] = useState('')
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  const conversations: Conversation[] = [
    {
      id: 1,
      name: 'Abebe Mekonnen',
      status: 'Online',
      messages: [
        { type: 'received', text: "Hello! Are you interested in the premium teff?" },
        { type: 'sent', text: 'Yes, I would like 50kg. Is it available?' },
        { type: 'received', text: "Yes, it's available. I can ship tomorrow." },
      ],
    },
    {
      id: 2,
      name: 'Meron Tadesse',
      status: 'Offline',
      messages: [
        { type: 'received', text: 'Delivery takes 2 days.' },
      ],
    },
  ]

  return (
    <div>
      <Header />

      <div className="p-6 md:p-20 h-screen bg-[#F5F5F5]">
        <div className="grid md:grid-cols-4 h-full gap-4">

          {/* LEFT SIDE - CONVERSATIONS */}
          <div className="col-span-1 bg-white border-r shadow rounded-2xl py-4 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 px-4">Messages</h2>
            <div className="flex-1 relative w-full px-6 mb-4">
              <Search className="absolute mx-2 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="pl-10 pr-4 h-10 bg-white w-full rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>

            <div className="space-y-3 px-4">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 rounded-xl cursor-pointer ${
                    selectedConversation?.id === conv.id ? 'bg-emerald-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <p className="font-medium">{conv.name}</p>
                  <p className="text-sm text-gray-500 truncate">
                    {conv.messages[conv.messages.length - 1].text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE - CHAT AREA */}
          <div className="col-span-3 flex flex-col h-full shadow rounded-2xl bg-white">
            
            {selectedConversation ? (
              <>
                {/* CHAT HEADER */}
                <div className="bg-white border-b rounded-t-2xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                    <p className={`text-sm ${selectedConversation.status === 'Online' ? 'text-green-500' : 'text-gray-400'}`}>
                      {selectedConversation.status}
                    </p>
                  </div>
                </div>

                {/* MESSAGES */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {selectedConversation.messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`p-3 rounded-2xl max-w-xs ${
                          msg.type === 'sent' ? 'bg-emerald-600 text-white' : 'bg-gray-100'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* MESSAGE INPUT */}
                <div className="bg-white border-t p-4 rounded-b-2xl">
                  <div className="flex items-center gap-3">
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4">
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-lg font-medium">
                Start a conversation by selecting a contact
              </div>
            )}

          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}