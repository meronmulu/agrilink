'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { sendMessageToAI } from '@/services/aiAssistance'

export default function AiAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMsg = { role: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const res = await sendMessageToAI(input)

      const aiMsg = {
        role: 'ai',
        text: res.response
      }

      setMessages(prev => [...prev, aiMsg])
      setInput('')
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: ' Failed to get response' }
      ])
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-xl bg-emerald-500"
        >
          <Plus />
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md flex flex-col h-[500px]">
          
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 border rounded-lg p-3 bg-gray-50">
            {messages.length === 0 && (
              <p className="text-sm text-gray-400 text-center">
                Start a conversation 
              </p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[80%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white border'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-xs text-gray-400"> typing...</p>
            )}
          </div>

          {/* Input Area */}
          <div className="flex gap-2 mt-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button onClick={handleSend} disabled={loading} className='bg-emerald-500 text-white'>
              Send
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </>
  )
}