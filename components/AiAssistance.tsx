'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, CloudSun, TrendingUp, Sprout, Mic, MicOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'

import { sendMessageToAI } from '@/services/aiAssistance'
import { useLanguage } from '@/context/LanguageContext'

const suggestedQuestions = {
  agronomist: [
    'When is the best time to plant maize in Oromia?',
    'What fertilizer is best for clay soil?',
    'How do I control wheat rust disease?'
  ],
  market: [
    'Current tomato price in Addis Ababa?',
    'Where can I sell onions in bulk?',
    'Which crop has highest market demand now?'
  ],
  weather: [
    'Will it rain next week in Amhara?',
    'Is there frost risk this month?',
    'Best irrigation timing this week?'
  ]
}

export default function AiAssistant() {
const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [expanded] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedAgent, setSelectedAgent] = useState<'agronomist' | 'market' | 'weather' | null>(null)
  
  // VOICE STATES
  const [isListening, setIsListening] = useState(false)
  const [wasVoiceInput, setWasVoiceInput] = useState(false)
  const recognitionRef = useRef<any>(null)

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

  // --- NEW: AI VOICE RESPONSE (READ TEXT) ---
  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      if (lang === 'am') utterance.lang = 'am-ET'
      else if (lang === 'om') utterance.lang = 'om-ET'
      else utterance.lang = 'en-US'
      window.speechSynthesis.speak(utterance)
    }
  }

  // --- NEW: VOICE INPUT (AMHARIC/OROMO SUPPORT) ---
  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return alert("Browser not supported")

    if (isListening) {
      recognitionRef.current?.stop()
      return
    }

    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    
    // Set language based on app context
    if (lang === 'am') recognition.lang = 'am-ET'
    else if (lang === 'om') recognition.lang = 'om-ET'
    else recognition.lang = 'en-US'

    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
      setWasVoiceInput(true)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
    recognition.start()
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const currentInput = input
    const isVoiceSession = wasVoiceInput
    const userMsg = { role: 'user', text: currentInput, timestamp: new Date() }
    
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setWasVoiceInput(false)
    setLoading(true)

    try {
      // Force AI to respond in the correct language
      let langNote = ""
      if (lang === 'am') langNote = " (Respond in Amharic)"
      if (lang === 'om') langNote = " (Respond in Oromo)"

      const res = await sendMessageToAI(currentInput + langNote)
      const aiMsg = { role: 'ai', text: res.response, timestamp: new Date() }
      setMessages(prev => [...prev, aiMsg])

      // Read aloud if user used the mic
      if (isVoiceSession) speakText(res.response)

    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: t('ai_failed_response') || 'Failed.', timestamp: new Date(), isError: true }])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <div className="fixed bottom-12 right-6 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 hover:scale-105"
        >
          AI
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`flex flex-col transition-all duration-300 ${expanded
            ? 'w-[95vw] max-w-[95vw] h-screen max-h-screen'
            : 'w-[90vw] max-w-[90vw] sm:max-w-2xl h-screen max-h-screen'} p-0 gap-0 rounded-xl overflow-hidden`}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b bg-linear-to-r from-emerald-500 to-teal-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <DialogTitle className="text-white text-lg font-semibold">
                {t('ai_assistant') || 'AI Assistant'}
              </DialogTitle>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-gray-100">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="h-full flex flex-col items-center justify-center text-center px-6">
                  <Bot className="w-14 h-14 text-emerald-500 mb-4" />
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Smart Farm Assistant 🌱</h2>
                  <p className="text-sm text-gray-500 max-w-md mb-6">Choose an expert or ask your own question.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-6">
                    <div onClick={() => setSelectedAgent('agronomist')} className={`p-4 rounded-xl border bg-white hover:shadow-md transition cursor-pointer ${selectedAgent === 'agronomist' ? 'border-emerald-500 shadow-md' : ''}`}>
                      <div className="flex items-center justify-center mb-2 text-green-600"><Sprout className="w-6 h-6" /></div>
                      <h3 className="text-sm font-semibold">Agronomist</h3>
                    </div>
                    <div onClick={() => setSelectedAgent('market')} className={`p-4 rounded-xl border bg-white hover:shadow-md transition cursor-pointer ${selectedAgent === 'market' ? 'border-emerald-500 shadow-md' : ''}`}>
                      <div className="flex items-center justify-center mb-2 text-yellow-600"><TrendingUp className="w-6 h-6" /></div>
                      <h3 className="text-sm font-semibold">Market</h3>
                    </div>
                    <div onClick={() => setSelectedAgent('weather')} className={`p-4 rounded-xl border bg-white hover:shadow-md transition cursor-pointer ${selectedAgent === 'weather' ? 'border-emerald-500 shadow-md' : ''}`}>
                      <div className="flex items-center justify-center mb-2 text-blue-600"><CloudSun className="w-6 h-6" /></div>
                      <h3 className="text-sm font-semibold">Weather</h3>
                    </div>
                  </div>
                </div>

                {selectedAgent && (
                  <div className="w-full max-w-2xl mt-2 animate-in fade-in slide-in-from-top-2 px-6">
                    <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Suggested Questions</p>
                    <div className="space-y-2">
                      {suggestedQuestions[selectedAgent].map((q, i) => (
                        <button key={i} onClick={() => { setInput(q); setWasVoiceInput(false); }} className="block text-left text-sm text-emerald-600 hover:text-emerald-700 hover:underline">{q}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {msg.role === 'ai' && <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0"><Bot className="w-4 h-4 text-white" /></div>}
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user' ? 'bg-emerald-500 text-white' : 'bg-white border text-gray-700'}`}>
                      {msg.text}
                      <p className="text-[10px] opacity-60 mt-1">{formatTime(msg.timestamp)}</p>
                    </div>
                    {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-gray-600" /></div>}
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start gap-2 items-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><Bot className="w-4 h-4 text-white" /></div>
                    <div className="bg-white border rounded-2xl px-4 py-3 shadow-sm italic text-sm text-emerald-600">Thinking...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleVoiceInput}
                className={`rounded-xl px-3 border transition-all ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-500"}`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </Button>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => { setInput(e.target.value); setWasVoiceInput(false); }}
                placeholder={isListening ? 'Listening...' : (t('ai_ask_anything') || 'Ask me anything...')}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-xl px-6 transition-all duration-300 hover:scale-105">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}