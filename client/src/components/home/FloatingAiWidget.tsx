"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  X,
  SendHorizontal,
  Bot,
  User,
  Zap,
  Lock,
} from "lucide-react";
import {
  sendAiChatApi,
  fetchAiQuotaApi,
  QuotaData,
} from "@/services/aiService";
import toast from "react-hot-toast";
import FitoraPillButton from "@/components/ui/FitoraPillButton";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  {
    label: "🏋️ Hypertrophy Split",
    query: "What is the best 4-day workout split for muscle hypertrophy?",
  },
  {
    label: "🥩 Daily Protein Macros",
    query: "How many grams of protein should I consume daily for bodybuilding?",
  },
  {
    label: "🔥 Fat Loss Routine",
    query:
      "Give me an effective fat loss workout and calorie deficit strategy.",
  },
  {
    label: "💊 Creatine & Whey",
    query: "How should I dose creatine monohydrate and whey protein?",
  },
  {
    label: "⏱️ Rest Between Sets",
    query:
      "What is the optimal rest time between heavy compound sets vs isolation?",
  },
];

export default function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [quota, setQuota] = useState<QuotaData | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to FITORA AI! I am your 24/7 certified Personal Trainer and Sports Nutritionist. Ask me anything about workout routines, progressive overload, bodybuilding macros, or gym exercises!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Load live quota when widget opens
  useEffect(() => {
    if (isOpen) {
      fetchAiQuotaApi().then((res) => {
        if (res.success && res.data) {
          setQuota(res.data);
        }
      });
    }
  }, [isOpen]);

  // Track scroll depth for the floating button
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

    // Check client-side quota limit
    if (quota && quota.plansRemaining <= 0) {
      toast.error("Daily free AI plan limit reached. Please upgrade to Pro!");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    try {
      const res = await sendAiChatApi(query, "coach");
      if (res.success && res.data) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: res.data.responseText,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, aiMessage]);

        // Refresh quota state
        if (res.data.quota) {
          setQuota(res.data.quota);
        }
      } else {
        toast.error(res.message || "Failed to generate response.");
      }
    } catch (err: any) {
      toast.error(err.message || "Connection error. Please try again.");
    } finally {
      setIsTyping(false);
    }
  };

  const isQuotaExhausted = quota !== null && quota.plansRemaining <= 0;

  return (
    <div ref={widgetRef} className="relative z-50">
      {/* ─── 1. AI Chat Studio Modal ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[580px] max-h-[85vh] bg-black/95 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden z-50 text-white font-sans"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-900/80 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Image
                    src="/gemini-logo.png"
                    alt="Gemini"
                    width={22}
                    height={22}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-wider uppercase">
                      FITORA AI TRAINER
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Personalized Gym & Nutrition Coach
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Daily Quota Counter Badge */}
                {quota && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/15 flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-amber-400" />
                    {quota.plansRemaining}/{quota.plansLimit} Left
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer text-gray-400 hover:text-white"
                  aria-label="Close AI Studio"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === "user"
                        ? "bg-white text-black"
                        : "bg-white/10 text-white border border-white/20"
                    }`}
                  >
                    {msg.sender === "user" ? (
                      <User className="w-3.5 h-3.5" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-white text-black rounded-tr-none font-medium shadow-lg"
                        : "bg-neutral-900/90 text-gray-200 border border-white/10 rounded-tl-none whitespace-pre-line"
                    }`}
                  >
                    {msg.text}
                    <span
                      className={`block text-[9px] mt-1.5 ${
                        msg.sender === "user"
                          ? "text-gray-500 text-right"
                          : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-gray-400 text-xs pl-9">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>FITORA AI is analyzing your fitness request...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="px-3 py-2 bg-neutral-950/80 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
              {QUICK_SUGGESTIONS.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  disabled={isTyping || isQuotaExhausted}
                  onClick={() => handleSendMessage(sug.query)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-[11px] text-gray-300 whitespace-nowrap transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Chat Input Bar or Quota Lock Banner */}
            {isQuotaExhausted ? (
              <div className="p-3 bg-neutral-950 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left shrink-0">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs text-gray-300 font-bold">
                    Daily Free AI quota reached ({quota?.plansUsed}/
                    {quota?.plansLimit} plans). Upgrade for 10 daily plans!
                  </span>
                </div>
                <FitoraPillButton
                  variant="white"
                  size="sm"
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                >
                  UPGRADE TO PRO
                </FitoraPillButton>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-2 sm:p-2.5 bg-neutral-900/90 border-t border-white/15 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask FITORA AI Trainer about workouts, exercises, macros..."
                  className="bg-black text-[11px] sm:text-sm text-white placeholder-gray-500 px-4 py-2 rounded-full outline-none w-full border border-white/20 focus:border-white transition-colors font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black disabled:bg-neutral-800 disabled:text-gray-600 flex items-center justify-center shrink-0 transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                  aria-label="Send Message"
                >
                  <SendHorizontal className="w-4 h-4 stroke-[2.5]" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. Floating AI Trigger Button ─── */}
      {!isOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          className={`group flex items-center justify-center font-bold cursor-pointer transition-all duration-300 z-[45] pointer-events-auto select-none ${
            isScrolled
              ? "fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black text-white border-[3.5px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95"
              : "absolute bottom-[-2px] sm:bottom-[-2px] left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black border-[3px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] hover:scale-110 active:scale-95"
          }`}
          aria-label="Open FITORA AI Personal Trainer"
        >
          {isScrolled ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white stroke-none group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" />
              <span className="text-[11px] sm:text-xs tracking-wide">
                AI Coach
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Image
                src="/gemini-logo.png"
                alt="Google Gemini"
                width={36}
                height={36}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain group-hover:rotate-12 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(66,133,244,0.5)]"
                priority
              />
            </div>
          )}
        </button>
      )}
    </div>
  );
}
