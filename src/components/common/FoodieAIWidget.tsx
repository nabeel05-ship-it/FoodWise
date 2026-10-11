"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";
import { Sparkles, Send, X, Bot } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { MOTION_SPRINGS, MOTION_DURATIONS } from "@/lib/motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FoodieAIWidget() {
  const { userRole } = useApp();
  const pathname = usePathname();
  const prefersReduced = useReducedMotion();

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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const toggleDrawer = () => setIsOpen(!isOpen);

  const getSuggestions = () => {
    switch (userRole) {
      case "HOUSEHOLD":
        return ["How do I donate food?", "What should I prepare for pickup?", "Where can I see my donations?"];
      case "HOTEL":
        return ["How do I list restaurant/banquet surplus?", "How do I schedule pickup?", "How do I track redistribution?"];
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
    } catch (error: unknown) {
      setErrorMsg(error instanceof Error ? error.message : "Foodie AI is temporarily unavailable.");
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
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            key="foodie-ai-trigger"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
            transition={MOTION_SPRINGS.natural}
            whileHover={
              prefersReduced
                ? undefined
                : {
                    scale: 1.04,
                    boxShadow: "0 14px 30px -4px rgba(16, 185, 129, 0.28), 0 6px 14px -2px rgba(0, 0, 0, 0.08)",
                  }
            }
            whileTap={prefersReduced ? undefined : { scale: 0.95 }}
            onClick={toggleDrawer}
            aria-label="Open Foodie AI"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white border border-emerald-200/80 shadow-lg rounded-full p-2 pr-4 text-sm font-semibold text-gray-800 flex items-center gap-2.5 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 z-50 group cursor-pointer"
          >
            <div className="relative flex items-center justify-center bg-emerald-50 group-hover:bg-emerald-100 text-emerald-600 p-2 rounded-full transition-colors">
              <Sparkles className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <span className="tracking-wide font-bold text-xs sm:text-sm text-emerald-950">Foodie AI</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="foodie-ai-panel"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.94 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
            transition={prefersReduced ? { duration: MOTION_DURATIONS.fast } : MOTION_SPRINGS.natural}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[360px] max-w-[calc(100vw-2rem)] bg-white border border-gray-200 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50 max-h-[85vh]"
          >
            {/* Header */}
            <div
              className="p-4 text-white flex justify-between items-center shrink-0 shadow-md z-10 relative"
              style={{ background: "linear-gradient(135deg, #072B1E 0%, #164A31 60%, #10B981 100%)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-emerald-300 border border-white/15">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-1.5 leading-tight">
                    Foodie AI <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  </h3>
                  <p className="text-emerald-100/90 text-[11px] font-medium">Role-aware assistant • {userRole || "FoodWise"}</p>
                </div>
              </div>
              <button
                onClick={toggleDrawer}
                aria-label="Close Foodie AI"
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#F9FAFB] flex flex-col space-y-3.5 max-h-[380px] min-h-[260px]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={prefersReduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: MOTION_DURATIONS.fast }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "text-white rounded-br-xs shadow-xs"
                        : "bg-white text-gray-800 border border-gray-200 shadow-2xs rounded-bl-xs"
                    }`}
                    style={msg.role === "user" ? { background: "#164A31" } : undefined}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {messages.length === 1 && (
                <motion.div
                  initial={prefersReduced ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col space-y-1.5 mt-2"
                >
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider px-1">Suggested questions:</p>
                  {getSuggestions().map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(suggestion)}
                      className="text-left text-xs text-emerald-900 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/80 rounded-xl px-3 py-2 transition-all cursor-pointer active:scale-98"
                    >
                      {suggestion}
                    </button>
                  ))}
                </motion.div>
              )}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white border border-gray-200 shadow-2xs rounded-2xl rounded-bl-xs px-3.5 py-2.5 flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                    <span className="text-[11px] text-gray-400 font-medium ml-1">Thinking...</span>
                  </div>
                </motion.div>
              )}

              {errorMsg && (
                <div className="flex justify-center my-1">
                  <div className="bg-rose-50 text-rose-700 text-xs px-3 py-2 rounded-xl border border-rose-200 text-center">
                    {errorMsg}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Foodie AI..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSend(inputValue)}
                  disabled={!inputValue.trim() || isLoading}
                  aria-label="Send message"
                  className="text-white rounded-xl p-2 h-9 w-9 flex items-center justify-center shrink-0 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-95"
                  style={{ background: "#164A31" }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center mt-2 px-1">
                <span className="text-[10px] leading-tight text-gray-500 font-medium block bg-gray-50 py-1 rounded border border-gray-100">
                  Foodie AI provides guidance. For food quality issues, use &ldquo;Report Food Issue&rdquo;.
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
