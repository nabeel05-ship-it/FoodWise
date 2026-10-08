"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FoodieAIWidget() {
  const { userRole } = useApp();
  const pathname = usePathname();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm Foodie AI. I can help you understand FoodWise and answer questions related to your role." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const getSuggestions = () => {
    switch (userRole) {
      case "HOUSEHOLD":
        return ["How do I donate food?", "What should I prepare for pickup?", "Where can I see my donations?"];
      case "RESTAURANT":
        return ["How do I post surplus?", "How does pickup work?", "How do I track my impact?"];
      case "HOTEL":
        return ["How do I list banquet surplus?", "How do I schedule pickup?", "How do I track redistribution?"];
      case "NGO":
        return ["How do I accept food?", "How do I report a food issue?", "How do I track deliveries?"];
      default:
        return ["How do I use FoodWise?"];
    }
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: "user", content }];
    setMessages(newMessages);
    setInputValue("");
    setErrorMsg("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/foodie-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          role: userRole,
          currentSection: pathname,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
    } catch (error: any) {
      setErrorMsg(error.message || "Foodie AI is temporarily unavailable.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend(inputValue);
    }
  };

  // Do not show widget on login page
  if (pathname === '/login' || pathname === '/') return null;

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleDrawer}
          aria-label="Open Foodie AI"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white border border-gray-200 shadow-lg hover:shadow-xl rounded-full p-2 pr-4 text-sm font-semibold text-gray-700 flex items-center gap-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 z-50 group"
        >
          <div className="relative flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 p-2 rounded-full transition-colors">
            <Sparkles className="w-4 h-4" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          <span className="tracking-wide">Foodie AI</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] bg-white border border-gray-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex justify-between items-center shrink-0 shadow-md z-10 relative">
            <div>
              <h3 className="font-extrabold text-lg flex items-center gap-2 drop-shadow-sm">
                <Sparkles className="w-5 h-5 text-emerald-100" /> Foodie AI
              </h3>
              <p className="text-emerald-50 text-xs font-medium mt-0.5 opacity-90">Your smart FoodWise assistant</p>
            </div>
            <button
              onClick={toggleDrawer}
              className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col space-y-4 max-h-[400px] min-h-[300px]">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 shadow-sm rounded-bl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}
            
            {messages.length === 1 && (
              <div className="flex flex-col space-y-2 mt-4">
                <p className="text-xs text-gray-500 font-medium px-2">Suggested questions:</p>
                {getSuggestions().map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(suggestion)}
                    className="text-left text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg px-3 py-2 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
            
            {errorMsg && (
              <div className="flex justify-center my-2">
                <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100 text-center">
                  {errorMsg}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Foodie AI..."
                className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend(inputValue)}
                disabled={!inputValue.trim() || isLoading}
                className="bg-emerald-600 text-white rounded-full p-2 h-10 w-10 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
                </svg>
              </button>
            </div>
            <div className="text-center mt-3 mb-1 px-2">
               <span className="text-[10px] leading-tight text-gray-500 font-medium block bg-gray-50 py-1 rounded border border-gray-100">
                 ⚠️ This is AI-generated and may contain mistakes.
               </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
