'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

import { sendMessageToAI } from '@/services/aiAssistance'
import { useLanguage } from '@/context/LanguageContext'

export default function AiAssistant() {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', text: input, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await sendMessageToAI(input)

      const aiMsg = {
        role: 'ai',
        text: res.response,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMsg])
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: t('ai_failed_response') || ' Failed to get response. Please try again.',
          timestamp: new Date(),
          isError: true
        }
      ])
      console.log(error)
    } finally {
      setLoading(false)
    }
  }



  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-12 right-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
        >
          {/* <Plus className="w-6 h-6 text-white" /> */}
          AI
        </Button>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`flex flex-col transition-all duration-300 ${expanded
              ? 'w-[95vw] max-w-[95vw] h-screen max-h-screen'
              : 'w-[90vw] max-w-[90vw] sm:max-w-2xl h-screen max-h-screen'
            } p-0 gap-0 rounded-xl overflow-hidden`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-emerald-500 to-teal-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-white text-lg font-semibold">
                  {t('ai_assistant') || 'AI Assistant'}
                </DialogTitle>
              </div>
            </div>

          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-gray-100">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">

                {/* <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {t('ai_welcome') || 'Welcome to AI Assistant!'}
                </h3> */}
                <p className="text-sm text-gray-500 max-w-md">
                  {"Ask me anything - I'm here to help you with questions, tasks, or just a friendly conversation."}
                </p>
                 <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(t('ai_what_can_help_input') || "What can you help me with?")}
                    className="text-xs mt-6"
                  >
                    {t('ai_what_can_help') || 'What can you help with?'}
                  </Button>
                 </div>
                <div className="flex gap-2 mt-2">
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput( "When is the best time to plant maize in my region?")}
                    className="text-xs"
                  >
                    When is the best time to plant maize in my region?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInput( "What fertilizer should I use for clay soil?")}
                    className="text-xs"
                  >
                    What fertilizer should I use for clay soil?                  
                    </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                        ? 'bg-emerald-500'
                        : 'bg-linear-to-r from-emerald-500 to-teal-500'
                      }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div>
                      <div
                        className={`px-4 py-2 rounded-2xl shadow-sm ${msg.role === 'user'
                            ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white'
                            : msg.isError
                              ? 'bg-red-50 border border-red-200 text-red-700'
                              : 'bg-white border border-gray-200 text-gray-700'
                          }`}
                      >
                        <p className="text-sm whitespace-pre-wrap wrap-break-word">
                          {msg.text}
                        </p>
                      </div>
                      <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-right text-gray-400' : 'text-left text-gray-400'
                        }`}>
                        {formatTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start animate-in fade-in duration-300">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t bg-white p-4">

            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('ai_ask_anything') || "Ask me anything..."}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                disabled={loading}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl px-6 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}