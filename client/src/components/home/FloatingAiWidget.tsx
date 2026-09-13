"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  MessageSquare,
  Dumbbell,
  X,
  ArrowUpRight,
  SendHorizontal,
  ChevronLeft,
  Bot,
  User,
  Maximize2,
  Zap,
  Trash2,
  Lock,
} from "lucide-react";
import { sendAiChatApi } from "@/services/aiService";
import { sendAiChatApi, fetchAiQuotaApi, QuotaData } from "@/services/aiService";
import toast from "react-hot-toast";
import FitoraPillButton from "@/components/ui/FitoraPillButton";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

const QUICK_SUGGESTIONS = [
  { label: "🏋️ Hypertrophy Split", query: "What is the best 4-day workout split for muscle hypertrophy?" },
  { label: "🥩 Daily Protein Macros", query: "How many grams of protein should I consume daily for bodybuilding?" },
  { label: "🔥 Fat Loss Routine", query: "Give me an effective fat loss workout and calorie deficit strategy." },
  { label: "💊 Creatine & Whey", query: "How should I dose creatine monohydrate and whey protein?" },
  { label: "⏱️ Rest Between Sets", query: "What is the optimal rest time between heavy compound sets vs isolation?" },
];

export default function FloatingAiWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"chat" | "coach" | null>(
    null,
  );
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [quota, setQuota] = useState<QuotaData | null>(null);

  const [chatMessages, setChatMessages] = useState<Message[]>([
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to FITORA AI Chat! Ask me anything about workout programming, progressive overload, nutrition macros, or gym guidance.",
      text: "Welcome to FITORA AI! I am your 24/7 certified Personal Trainer and Sports Nutritionist. Ask me anything about workout routines, progressive overload, bodybuilding macros, or gym exercises!",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [coachMessages, setCoachMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to FITORA AI Personal Coach Studio! What is your primary fitness goal (e.g. Muscle Gain, Fat Loss, Strength) and target timeline?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Smooth scroll listener for morphing position
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

  // Track scroll depth for the morphing floating button
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 60);
      }
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollPos > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, coachMessages, isTyping]);
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

  // Bulletproof click-outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!document.body.contains(target)) return;
      if (widgetRef.current && !widgetRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleClearHistory = () => {
    if (selectedMode === "chat") {
      setChatMessages([
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Chat cleared! How can FITORA AI help you with your fitness journey today?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } else {
      setCoachMessages([
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Coach session reset! What workout split or calorie target would you like to build?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    // Check quota locally if already known to be exhausted
    if (quota && quota.plansRemaining <= 0 && quota.chatsRemaining <= 0) {
      toast.error("Daily AI limit reached! Upgrade to FITORA Pro for 10 daily plans.");
      return;
    }
    toast.success("Conversation history cleared!");
  };

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    if (selectedMode === "chat") {
      setChatMessages((prev) => [...prev, userMsg]);
    } else {
      setCoachMessages((prev) => [...prev, userMsg]);
    }

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const mode = selectedMode === "coach" ? "coach" : "chat";
      const apiResult = await sendAiChatApi(textToSend, mode);
      const res = await sendAiChatApi(text, "chat");

      let responseText = "";
      if (apiResult.success && apiResult.data?.responseText) {
        responseText = apiResult.data.responseText;
      if (res.success && res.data?.responseText) {
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

        // Update quota from server response if available
        if (res.data.quota) {
          setQuota(res.data.quota);
        }
      } else {
        // Local Intelligent Fallback
        if (mode === "chat") {
          if (
            textToSend.toLowerCase().includes("protein") ||
            textToSend.toLowerCase().includes("diet") ||
            textToSend.toLowerCase().includes("meal")
          ) {
            responseText =
              "For optimal muscle synthesis & recovery, target 1.6 - 2.2g of protein per kg of bodyweight daily. Prioritize whole sources like chicken breast, eggs, fish, lentils, and whey protein isolates.";
          } else if (
            textToSend.toLowerCase().includes("split") ||
            textToSend.toLowerCase().includes("routine") ||
            textToSend.toLowerCase().includes("workout")
          ) {
            responseText =
              "A 6-day Push-Pull-Legs (PPL) or 4-day Upper-Lower split is optimal for hypertrophy & strength gains. Ensure 10-20 hard sets per muscle group weekly with progressive overload!";
          } else {
            responseText =
              "FITORA AI recommends focusing on progressive overload, adequate hydration (3.5L daily), and 7-8 hours of sleep for peak athletic performance & recovery.";
          }
        } else {
          if (
            textToSend.toLowerCase().includes("loss") ||
            textToSend.toLowerCase().includes("fat")
          ) {
            responseText =
              "Fat Loss Blueprint Generated: 350 kcal daily deficit + 4-day Resistance Training + 25 min LISS Cardio. You can view your complete macro targets in AI Coach Studio!";
          } else if (
            textToSend.toLowerCase().includes("muscle") ||
            textToSend.toLowerCase().includes("gain")
          ) {
            responseText =
              "Hypertrophy Program Generated: 250 kcal surplus + 5-day Compound Heavy Split (6-10 rep range). Open full AI Coach Studio to track weekly progress!";
          } else {
            responseText =
              "Custom Training Routine Generated! You can view detailed macro calculations, calorie targets & workout logs inside the main AI Coach Studio.";
          }
        }
        toast.error(res.error || "Failed to get AI coach response.");
        const fallbackMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text:
            res.error ||
            "I am FITORA AI, your dedicated Gym Trainer & Nutrition Coach. I am strictly programmed to assist only with gym workouts, exercises, diet macros, and fitness goals. How can I assist your physical training today?",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }
    } catch {
      toast.error("Network error while connecting to AI trainer.");
    } finally {
      setIsTyping(false);
    }
  };

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: responseText,
        text: "Conversation cleared. Ready for your next workout or nutrition question!",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      if (selectedMode === "chat") {
        setChatMessages((prev) => [...prev, aiMsg]);
      } else {
        setCoachMessages((prev) => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error("AI chat error:", err);
    } finally {
      setIsTyping(false);
    }
      },
    ]);
    toast.success("AI chat history cleared.");
  };

  const currentMessages =
    selectedMode === "chat" ? chatMessages : coachMessages;
  const isQuotaExhausted =
    quota && quota.plansRemaining <= 0 && quota.chatsRemaining <= 0;

  return (
    <div
      ref={widgetRef}
      className="absolute inset-0 select-none pointer-events-none"
    >
    <div className="relative z-50">
      {/* ─── 1. Live Interactive Studio Chat Window ─── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-[72px] sm:bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] xs:w-[calc(100vw-1.5rem)] sm:w-[640px] md:w-[720px] lg:w-[760px] max-w-[760px] max-h-[calc(100vh-120px)] flex flex-col bg-black text-white border-2 border-white/20 rounded-2xl sm:rounded-[2.2rem] shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-[40] pointer-events-auto"
            className="fixed bottom-[72px] sm:bottom-20 left-1/2 -translate-x-1/2 w-[calc(100vw-1rem)] xs:w-[calc(100vw-1.5rem)] sm:w-[640px] md:w-[720px] lg:w-[760px] max-w-[760px] max-h-[calc(100vh-110px)] flex flex-col bg-black text-white border-2 border-white/20 rounded-2xl sm:rounded-[2.2rem] shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden z-[40] pointer-events-auto"
          >
            {!selectedMode ? (
              <div className="p-3 sm:p-5 space-y-3 bg-gradient-to-b from-neutral-900 via-neutral-950 to-black overflow-y-auto max-h-[380px] sm:max-h-[420px]">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-white/15">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-lg shrink-0">
                      <Sparkles className="w-3.5 h-3.5 fill-black stroke-none" />
                    </span>
                    <div>
                      <h3 className="text-[11px] sm:text-sm font-black uppercase tracking-wider text-white leading-none">
                        Fitora AI{" "}
                        <span className="font-serif italic font-normal text-gray-400">
                          #Studio
            <div className="flex flex-col h-[calc(100vh-130px)] max-h-[460px] min-h-[300px] bg-black">
              {/* ── Chat Window Header ── */}
              <div className="flex items-center justify-between px-3 py-2.5 sm:px-5 sm:py-3 bg-neutral-900/90 border-b border-white/15 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                    <Dumbbell className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white leading-none">
                        FITORA AI Personal Trainer
                      </h3>
                      {quota && (
                        <span className="hidden xs:inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 border border-emerald-400/20">
                          <Zap className="w-2.5 h-2.5 text-emerald-400" />
                          {quota.plansRemaining}/{quota.plansLimit} Plans
                        </span>
                      </h3>
                      <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 tracking-widest uppercase block mt-0.5">
                        Gym & AI Personal Assistant
                      </span>
                      )}
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mt-0.5">
                      ● Gemini 1.5 Flash • Strict Gym Scope Active
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 rounded-full bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Close AI Widget"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-300 font-medium leading-relaxed">
                  Select an AI Assistant module to launch real-time interactive
                  studio chat:
                </p>

                {/* Options Buttons List (Stacked on 320px Mobile) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
                  {/* Option 1: AI Chat Assistant (Pure White Card) */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode("chat");
                    }}
                    className="group flex items-center justify-between p-3 sm:p-3.5 bg-white text-black rounded-xl sm:rounded-2xl hover:bg-gray-100 transition-all duration-300 shadow-xl border border-white/20 cursor-pointer text-left hover:scale-[1.02]"
                    onClick={handleClearHistory}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Clear Conversation"
                    aria-label="Clear Conversation"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black text-white flex items-center justify-center shrink-0 shadow-md">
                        <MessageSquare className="w-4 h-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] sm:text-sm font-black uppercase tracking-tight text-black leading-tight">
                          AI Chat Assistant
                        </h4>
                        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-600 mt-0.5">
                          Q&A, Fitness & Meal Advice
                        </p>
                      </div>
                    </div>
                    <span className="bg-black text-white w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 shrink-0">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Option 2: AI Coach Assistant (Pitch Black Card) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMode("coach");
                    }}
                    className="group flex items-center justify-between p-3 sm:p-3.5 bg-neutral-900 text-white rounded-xl sm:rounded-2xl hover:bg-neutral-800 transition-all duration-300 shadow-xl border border-white/20 cursor-pointer text-left hover:scale-[1.02]"
                    onClick={() => setIsOpen(false)}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    aria-label="Close AI Coach"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                        <Dumbbell className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div>
                        <h4 className="text-[11px] sm:text-sm font-black uppercase tracking-tight text-white leading-tight">
                          AI Personal Coach
                        </h4>
                        <p className="text-[9px] sm:text-[10px] font-semibold text-gray-400 mt-0.5">
                          Workout & Calorie Routines
                        </p>
                      </div>
                    </div>
                    <span className="bg-white text-black w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300 shrink-0">
                      <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

                <div className="pt-2 text-center border-t border-white/10">
                  <span className="text-[8px] sm:text-[9px] font-extrabold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Zap className="w-3 h-3 text-white" />
                    Powered by Fitora Gemini 2.0 AI Engine
              {/* ── Quota Alert Strip (if free or low quota) ── */}
              {quota && quota.tier === "free" && (
                <div className="px-3 py-1 bg-gradient-to-r from-neutral-900 to-black border-b border-white/10 flex items-center justify-between text-[9px] sm:text-[10px] text-gray-300 shrink-0">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Free Tier: <strong>{quota.plansRemaining}</strong> of {quota.plansLimit} daily plans remaining today
                  </span>
                  <Link
                    href="/pricing"
                    onClick={() => setIsOpen(false)}
                    className="text-white underline hover:text-amber-300 font-extrabold flex items-center gap-0.5"
                  >
                    Upgrade for 10/day
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </Link>
                </div>
              </div>
            ) : (
              /* STATE B: Live Floating Chat Window (320px Minimum Mobile Responsive) */
              <div className="flex flex-col h-[calc(100vh-140px)] max-h-[440px] min-h-[280px] bg-black">
                {/* Chat Window Header (Shrink-0) */}
                <div className="flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 bg-neutral-900/90 border-b border-white/15 shrink-0">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMode(null)}
                      className="w-7 h-7 rounded-full bg-neutral-800 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label="Back to Mode Selection"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
              )}

                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                        {selectedMode === "chat" ? (
                          <MessageSquare className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Dumbbell className="w-3.5 h-3.5 stroke-[2.5]" />
                        )}
              {/* ── Chat Messages Body ── */}
              <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-black text-[11px] sm:text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "ai" && (
                      <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h3 className="text-[11px] sm:text-xs font-black uppercase text-white leading-none">
                          {selectedMode === "chat"
                            ? "Fitora AI Chat"
                            : "Fitora AI Coach"}
                        </h3>
                        <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-400 uppercase tracking-wider block mt-0.5">
                          ● Gemini 2.0 Engine Active
                        </span>
                      </div>
                    </div>
                  </div>
                    )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleClearHistory}
                      className="w-7 h-7 rounded-full bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      title="Clear History"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-7 h-7 rounded-full bg-neutral-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                      aria-label="Close Chat"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Chat Messages Body (Flex-1 Min-H-0) */}
                <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto space-y-2.5 bg-black text-[11px] sm:text-xs">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      className={`max-w-[86%] p-3 rounded-2xl ${
                        msg.sender === "user"
                          ? "bg-white text-black font-extrabold rounded-tr-none shadow-xl"
                          : "bg-neutral-900 text-gray-100 border border-white/15 rounded-tl-none leading-relaxed shadow-md font-medium"
                      }`}
                    >
                      {msg.sender === "ai" && (
                        <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 mt-0.5 shadow-md">
                          <Bot className="w-3 h-3" />
                        </div>
                      )}

                      <div
                        className={`max-w-[86%] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${
                          msg.sender === "user"
                            ? "bg-white text-black font-extrabold rounded-tr-none shadow-xl"
                            : "bg-neutral-900 text-gray-100 border border-white/15 rounded-tl-none leading-relaxed shadow-md font-medium"
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span
                        className={`text-[8px] sm:text-[9px] block text-right mt-1 font-bold ${
                          msg.sender === "user" ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                        <span
                          className={`text-[8px] sm:text-[9px] block text-right mt-1 font-bold ${
                            msg.sender === "user"
                              ? "text-gray-500"
                              : "text-gray-400"
                          }`}
                        >
                          {msg.timestamp}
                        </span>
                      </div>

                      {msg.sender === "user" && (
                        <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-neutral-800 text-white border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                          <User className="w-3 h-3" />
                        </div>
                      )}
                        {msg.timestamp}
                      </span>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs pt-0.5">
                      <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                        <Bot className="w-3 h-3" />
                    {msg.sender === "user" && (
                      <div className="w-6 h-6 rounded-full bg-neutral-800 text-white border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-3 h-3" />
                      </div>
                      <div className="bg-neutral-900 border border-white/15 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl rounded-tl-none flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] sm:text-xs pt-0.5">
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                    <div className="bg-neutral-900 border border-white/15 px-3.5 py-2 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

                {/* Quick Prompts Suggestions */}
                <div className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-neutral-950 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar">
                  {selectedMode === "chat" ? (
                    <>
                      <button
                        onClick={() =>
                          handleSendMessage(
                            "Best workout split for muscle gain?",
                          )
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        🏋️ Muscle Split
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage("High protein meal plan")
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        🥗 Protein Diet
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage("Rest time between sets?")
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        ⏱️ Rest Time
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          handleSendMessage("Create Fat Loss Plan")
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        🔥 Fat Loss
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage("Hypertrophy Muscle Plan")
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        💪 Hypertrophy
                      </button>
                      <button
                        onClick={() =>
                          handleSendMessage("Calorie Surplus Targets")
                        }
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px]"
                      >
                        🍎 Surplus Macros
                      </button>
                    </>
                  )}
              {/* ── Quick Action Fitness Prompt Chips ── */}
              <div className="px-2.5 py-1.5 bg-neutral-950 border-t border-white/10 flex items-center gap-1.5 overflow-x-auto text-[10px] shrink-0 no-scrollbar">
                {QUICK_SUGGESTIONS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.query)}
                    className="px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-gray-300 border border-white/15 font-bold transition-all whitespace-nowrap active:scale-95 cursor-pointer text-[9px] sm:text-[10px] shrink-0"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* ── Chat Input Bar or Quota Locked Banner ── */}
              {isQuotaExhausted ? (
                <div className="p-3 bg-neutral-950 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left shrink-0">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-xs text-gray-300 font-bold">
                      Daily Free AI quota reached ({quota?.plansUsed}/{quota?.plansLimit} plans). Upgrade for 10 daily plans!
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

                {/* Chat Input Bar */}
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="p-2 sm:p-2.5 bg-neutral-900/90 border-t border-white/15 flex items-center gap-1.5 shrink-0"
                  className="p-2 sm:p-2.5 bg-neutral-900/90 border-t border-white/15 flex items-center gap-2 shrink-0"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      selectedMode === "chat"
                        ? "Ask FITORA AI..."
                        : "Tell coach your goal..."
                    }
                    className="bg-black text-[11px] sm:text-sm text-white placeholder-gray-500 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full outline-none w-full border border-white/20 focus:border-white transition-colors font-medium"
                    placeholder="Ask FITORA AI Trainer about workouts, exercises, macros..."
                    className="bg-black text-[11px] sm:text-sm text-white placeholder-gray-500 px-4 py-2 rounded-full outline-none w-full border border-white/20 focus:border-white transition-colors font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black disabled:bg-neutral-800 disabled:text-gray-600 flex items-center justify-center shrink-0 transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                    disabled={!inputText.trim() || isTyping}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black disabled:bg-neutral-800 disabled:text-gray-600 flex items-center justify-center shrink-0 transition-all shadow-xl cursor-pointer hover:scale-105 active:scale-95"
                    aria-label="Send Message"
                  >
                    <SendHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    <SendHorizontal className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </form>
              </div>
            )}
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── 2. Morphing AI Trigger Button (Pure CSS Transitions, 320px Minimum Mobile Responsive) ─── */}
      {/* ─── 2. Floating AI Trigger Button ─── */}
      {!isOpen && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isOpen) {
              setIsOpen(false);
            } else {
              setSelectedMode(null); // ALWAYS start at AI Chat vs AI Coach selection menu first!
              setIsOpen(true);
            }
            setIsOpen(true);
          }}
          className={`group flex items-center justify-center font-bold cursor-pointer transition-all duration-300 z-[45] pointer-events-auto select-none ${
            isScrolled
              ? "fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black text-white border-[3.5px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95"
              : "absolute bottom-[-2px] sm:bottom-[-2px] left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black border-[3px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] hover:scale-110 active:scale-95"
          }`}
          aria-label="Open FITORA AI"
          aria-label="Open FITORA AI Personal Trainer"
        >
          {isScrolled ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white stroke-none group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" />
              <span className="text-[11px] sm:text-xs tracking-wide">
                Ask AI
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
