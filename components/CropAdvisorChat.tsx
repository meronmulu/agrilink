"use client";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://senakebede-crop-advisor-backend.hf.space/api/v1";

const quickQuestions = [
  "When is the best time to plant maize in my region?",
  "How do I control maize stalk borer in Ethiopia?",
  "What fertilizer should I use for clay soil?",
  "Should I plant with the current weather forecast?",
  "How much water does maize need during dry season?",
];

export default function CropAdvisorChat({ defaultLocation = "Central Ethiopia" }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState(defaultLocation);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
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
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.data.response,
        agentBreakdown: response.data.agent_breakdown || [],
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      let errorMessage = "Sorry, I encountered an error. Please try again.";
      if (error.code === "ECONNREFUSED") {
        errorMessage = "Cannot connect to the server.";
      } else if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data?.detail || "Unknown error"}`;
      } else if (error.request) {
        errorMessage = "No response from server.";
      } else if (error.message?.includes("Network Error")) {
        errorMessage = "Network error. Check your connection.";
      } else if (error.message?.includes("timeout")) {
        errorMessage = "Request timeout. The server is taking too long to respond.";
      }
      const errorMessageObj = {
        id: Date.now() + 1,
        type: "error",
        content: errorMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="bg-white rounded-xl shadow p-4 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold">Crop Advisor Chat</h2>
        <button className="text-sm text-blue-600" onClick={clearChat}>Clear Chat</button>
      </div>
      <div className="mb-2">
        <label className="text-sm mr-2">Location:</label>
        <input
          className="border rounded px-2 py-1 text-sm"
          value={location}
          onChange={e => setLocation(e.target.value)}
        />
      </div>
      <div className="h-72 overflow-y-auto bg-gray-50 rounded p-2 mb-2">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-center mt-8">
            <div className="mb-2">Ask about planting, weather, pests, or soil management.</div>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs hover:bg-emerald-200"
                  onClick={() => setInputMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-2 ${msg.type === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${msg.type === "user" ? "bg-emerald-200 text-emerald-900" : msg.type === "ai" ? "bg-blue-100 text-blue-900" : "bg-red-100 text-red-700"}`}>
                  <div className="text-xs font-semibold mb-1">
                    {msg.type === "user" ? "You" : msg.type === "ai" ? "Crop Advisor" : "Error"}
                    <span className="ml-2 text-gray-400 text-xs">{msg.timestamp}</span>
                  </div>
                  <div>{msg.content}</div>
                  {msg.agentBreakdown && msg.agentBreakdown.length > 0 && (
                    <div className="mt-2 text-xs">
                      <div className="font-bold mb-1">Expert Analysis:</div>
                      {msg.agentBreakdown.map((agent, idx) => (
                        <div key={idx} className="mb-1">
                          <span className="font-semibold">{agent.agent_type?.replace("_", " ") || "Expert"}</span>
                          <div className="w-full bg-gray-200 rounded h-2 mt-1">
                            <div
                              className="bg-emerald-400 h-2 rounded"
                              style={{ width: `${(agent.confidence || 0.5) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mb-2 text-left">
                <div className="inline-block px-3 py-2 rounded-lg bg-blue-100 text-blue-900">
                  <span className="animate-pulse">Agricultural experts are analyzing your question...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your question..."
          rows={1}
          className="flex-1 border rounded px-2 py-1 text-sm"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={!inputMessage.trim() || isLoading}
          className="bg-emerald-600 text-white px-4 py-1 rounded disabled:opacity-50"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-1">Press Enter to send • Shift+Enter for new line</div>
    </div>
  );
}
