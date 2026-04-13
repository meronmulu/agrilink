"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { SendHorizontal, BrainCircuit, Trash2, MapPin, Loader2 } from "lucide-react";

const API_BASE_URL = "https://senakebede-crop-advisor-backend.hf.space/api/v1";

const quickQuestions = [
  "When is the best time to plant maize in my region?",
  "How do I control maize stalk borer in Ethiopia?",
  "What fertilizer should I use for clay soil?",
  "Should I plant with the current weather forecast?",
  "How much water does maize need during dry season?",
];

type ChatMessage = {
  id: number;
  type: "user" | "ai" | "error";
  content: string;
  agentBreakdown?: { agent_type?: string; confidence?: number }[];
  timestamp: string;
};

export default function CropAdvisorChat({ defaultLocation = "Central Ethiopia" }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(defaultLocation);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage: ChatMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat`,
        { message: inputMessage, location },
        { timeout: 30000, headers: { "Content-Type": "application/json" } }
      );
      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.response,
        agentBreakdown: response.data.agent_breakdown || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: unknown) {
      const error = err as any;
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error?.code === "ECONNREFUSED") errorMessage = "Cannot connect to the server.";
      else if (error?.response) errorMessage = `Server error: ${error.response.status}`;
      else if (error?.request) errorMessage = "No response from server.";
      else if (error?.message?.includes("timeout")) errorMessage = "Request timed out. The server is taking too long.";
      else if (error?.message?.includes("Network Error")) errorMessage = "Network error. Check your connection.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, type: "error", content: errorMessage, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="flex flex-col h-full w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-emerald-50 to-white shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <BrainCircuit className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm sm:text-base">Crop Advisor AI</h2>
            <p className="text-xs text-gray-400 hidden sm:block">Powered by agricultural experts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Location input */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <input
              className="bg-transparent text-xs outline-none w-24 sm:w-36 text-gray-700"
              value={location}
              placeholder="Location"
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="p-1.5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition"
              title="Clear chat"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-gray-50/60">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 sm:py-16 text-center px-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <BrainCircuit className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1 text-sm sm:text-base">Ask the Crop Advisor</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 max-w-xs">
              Get expert advice on planting, weather, pests, soil, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="bg-white border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-xs hover:bg-emerald-50 hover:border-emerald-300 transition shadow-sm text-left"
                  onClick={() => setInputMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                {msg.type !== "user" && (
                  <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 shrink-0 mt-1">
                    <BrainCircuit className="h-4 w-4 text-emerald-600" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl shadow-sm
                    ${msg.type === "user"
                      ? "bg-emerald-500 text-white rounded-br-sm"
                      : msg.type === "error"
                        ? "bg-red-50 text-red-700 border border-red-100 rounded-bl-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
                    }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.content}</p>

                  {msg.agentBreakdown && msg.agentBreakdown.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      <p className="text-xs font-semibold text-gray-500">Expert Analysis</p>
                      {msg.agentBreakdown.map((agent, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{agent.agent_type?.replace(/_/g, " ") || "Expert"}</span>
                            <span>{Math.round((agent.confidence || 0.5) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div
                              className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${(agent.confidence || 0.5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className={`text-[10px] mt-1 ${msg.type === "user" ? "text-emerald-100 text-right" : "text-gray-400"}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center mr-2 shrink-0 mt-1">
                  <BrainCircuit className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t flex items-end gap-2 shrink-0">
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask about crops, weather, pests, or soil..."
          rows={1}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition max-h-32 min-w-0"
          disabled={isLoading}
          style={{ minHeight: "40px" }}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="shrink-0 h-10 w-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 flex items-center justify-center transition"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <SendHorizontal className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
      <p className="text-center text-[10px] text-gray-400 pb-2">Enter to send · Shift+Enter for new line</p>
    </div>
  );
}
