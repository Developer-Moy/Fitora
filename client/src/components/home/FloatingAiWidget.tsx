"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Zap,
  Lock,
  Trash2,
  ArrowUpRight,
  Dumbbell,
  Target,
  Flame,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  sendAiChatApi,
  fetchAiQuotaApi,
  QuotaData,
} from "@/services/aiService";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  AuthUser,
  AUTH_SESSION_UPDATED,
} from "@/services/authService";
import toast from "react-hot-toast";
import FitoraPillButton from "@/components/ui/FitoraPillButton";

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
}

/* ── Luxury Bespoke Fitness Protocols (Zero Emojis, 100% Fitora Brand DNA) ── */
const FITNESS_PROTOCOLS = [
  {
    tag: "HYPERTROPHY",
    title: "4-Day Muscle Split",
    desc: "Optimal push/pull split, volume distribution & progressive overload schedule.",
    icon: Dumbbell,
    query: "What is the best 4-day workout split for muscle hypertrophy?",
  },
  {
    tag: "NUTRITION",
    title: "Daily Macro Blueprint",
    desc: "Calculate precise protein, carb & caloric targets for lean muscle mass.",
    icon: Target,
    query: "How many grams of protein should I consume daily for bodybuilding?",
  },
  {
    tag: "FAT LOSS",
    title: "Fat Loss Accelerator",
    desc: "Structured calorie deficit training and metabolic cardio timing protocol.",
    icon: Flame,
    query:
      "Give me an effective fat loss workout and calorie deficit strategy.",
  },
  {
    tag: "RECOVERY",
    title: "Creatine & Supplement Stack",
    desc: "Evidence-based dosing timing, creatine monohydrate & muscle recovery.",
    icon: Zap,
    query:
      "How should I dose creatine monohydrate and whey protein for maximum results?",
  },
];

const COMPACT_PROMPTS = [
  {
    label: "Hypertrophy Split",
    icon: Dumbbell,
    query: "What is the best 4-day workout split for muscle hypertrophy?",
  },
  {
    label: "Protein Macros",
    icon: Target,
    query: "How many grams of protein should I consume daily for bodybuilding?",
  },
  {
    label: "Fat Loss Strategy",
    icon: Flame,
    query:
      "Give me an effective fat loss workout and calorie deficit strategy.",
  },
  {
    label: "Creatine & Whey",
    icon: Zap,
    query: "How should I dose creatine monohydrate and whey protein?",
  },
  {
    label: "Rest Intervals",
    icon: Clock,
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
  const [mounted, setMounted] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Welcome to FITORA AI Studio. I am your 24/7 certified Personal Trainer and Sports Nutritionist. Select a training protocol below or input your fitness query to generate a calibrated coaching blueprint.",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const protocolScrollRef = useRef<HTMLDivElement>(null);

  // Authenticated user resolution for real profile avatar
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (session.user) {
      setLocalUser(session.user);
    }
    const handleAuthUpdate = (e: any) => {
      if (e.detail?.user) {
        setLocalUser(e.detail.user);
      } else {
        const s = getAuthSession();
        setLocalUser(s.user);
      }
    };
    window.addEventListener(AUTH_SESSION_UPDATED, handleAuthUpdate);
    return () =>
      window.removeEventListener(AUTH_SESSION_UPDATED, handleAuthUpdate);
  }, []);

  const activeUser = authSession?.user || localUser;
  const userAvatar =
    localUser?.avatarUrl ||
    (activeUser as any)?.image ||
    (activeUser as any)?.avatarUrl ||
    "";
  const userName = activeUser?.name || "Athlete Member";
  const userInitial = userName.charAt(0).toUpperCase() || "U";

  const scrollProtocols = (direction: "left" | "right") => {
    if (protocolScrollRef.current) {
      protocolScrollRef.current.scrollBy({
        left: direction === "left" ? -180 : 180,
        behavior: "smooth",
      });
    }
  };

  // Ensure client-side portal mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth scroll listener for notch vs fixed bottom morphing position
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setIsScrolled(window.scrollY > 60);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isTyping) return;

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

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: "ai",
        text: "Session cleared. What fitness goal, workout split, or nutrition target would you like to calibrate today?",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  };

  const isQuotaExhausted = quota !== null && quota.plansRemaining <= 0;
  const isFreshConversation = messages.length <= 1;

  return (
    <>
      {/* ─── 1. Ultra-Premium AI Studio Modal (Portaled Directly to Viewport) ─── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Luxury Soft Backdrop Blur Click-Catcher */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-black/50 backdrop-blur-[3px] z-[9990] pointer-events-auto"
                />

                {/* Main Studio Modal Console */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 35,
                    scale: 0.95,
                    filter: "blur(6px)",
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  exit={{
                    opacity: 0,
                    y: 25,
                    scale: 0.95,
                    filter: "blur(4px)",
                  }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="fixed bottom-[80px] sm:bottom-24 left-1/2 -translate-x-1/2 w-[calc(100vw-1.5rem)] xs:w-[calc(100vw-2rem)] sm:w-[620px] md:w-[680px] max-w-[680px] h-[560px] max-h-[calc(100vh-120px)] flex flex-col bg-neutral-950/95 backdrop-blur-3xl border border-white/20 rounded-[2.2rem] shadow-[0_30px_90px_rgba(0,0,0,0.98),0_0_40px_rgba(255,255,255,0.08)] overflow-hidden z-[9999] pointer-events-auto font-sans before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
                >
                  {/* Header: Symmetrical Luxury Console Brand Bar */}
                  <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                      {/* Brand Logo Emblem */}
                      <div className="relative w-9 h-9 rounded-2xl bg-white text-black flex items-center justify-center shadow-lg border border-white/40 shrink-0">
                        <img
                          src="/logo.svg"
                          alt="Fitora"
                          className="w-5 h-5 object-contain brightness-0"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-black flex items-center justify-center">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white leading-none">
                            FITORA AI{" "}
                            <span className="font-serif italic font-normal text-gray-400">
                              #Studio
                            </span>
                          </h3>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mt-0.5">
                          Personal Gym Trainer & Nutritionist
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Live Daily Quota Pill Badge */}
                      {quota && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-wider text-gray-200 backdrop-blur-md shadow-sm">
                          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>
                            {quota.plansRemaining}/{quota.plansLimit} Plans
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleClearHistory}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                        title="Clear Conversation"
                        aria-label="Clear Conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white text-gray-300 hover:text-black border border-white/20 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-md"
                        aria-label="Close AI Studio"
                      >
                        <X className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Canvas Area */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-gradient-to-b from-black via-neutral-950 to-black text-xs sm:text-sm scrollbar-thin scrollbar-thumb-white/20">
                    {/* Welcome Screen: High-End Fitness Protocol Grid when chat is fresh */}
                    {isFreshConversation ? (
                      <div className="space-y-4 pt-1">
                        {/* Welcome Announcement Card */}
                        <div className="p-4 rounded-2xl bg-gradient-to-r from-neutral-900/90 to-neutral-900/40 border border-white/10 flex items-start gap-3 shadow-lg">
                          <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                            <img
                              src="/logo.svg"
                              alt="Fitora AI"
                              className="w-4.5 h-4.5 object-contain brightness-0"
                            />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                              Welcome to FITORA Intelligence
                            </h4>
                            <p className="text-[11px] sm:text-xs text-gray-300 leading-relaxed">
                              Your 24/7 certified gym trainer and nutrition
                              coach. Select a core fitness protocol below or ask
                              any custom question about workouts, macros, and
                              exercises.
                            </p>
                          </div>
                        </div>

                        {/* 2x2 Bespoke Protocol Cards Grid (Matches Homepage Luxury Card Language) */}
                        <div>
                          <div className="flex items-center justify-between pb-2 px-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                              Recommended Protocols
                            </span>
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                              1-Click Execution
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {FITNESS_PROTOCOLS.map((proto, i) => {
                              const IconComponent = proto.icon;
                              return (
                                <button
                                  key={i}
                                  type="button"
                                  disabled={isTyping || isQuotaExhausted}
                                  onClick={() => handleSendMessage(proto.query)}
                                  className="group flex flex-col justify-between p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/30 transition-all duration-300 text-left cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(255,255,255,0.06)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                  <div className="flex items-center justify-between w-full">
                                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[9px] font-black uppercase tracking-wider text-gray-300">
                                      <IconComponent className="w-2.5 h-2.5 text-white" />
                                      <span>{proto.tag}</span>
                                    </div>
                                    <span className="w-6 h-6 rounded-full bg-white/10 group-hover:bg-white text-gray-400 group-hover:text-black flex items-center justify-center transition-all duration-300 shadow-sm">
                                      <ArrowUpRight className="w-3 h-3 stroke-[2.5] group-hover:rotate-45 transition-transform duration-300" />
                                    </span>
                                  </div>

                                  <div className="mt-2.5">
                                    <h5 className="text-xs sm:text-[13px] font-black uppercase tracking-tight text-white group-hover:text-white leading-tight">
                                      {proto.title}
                                    </h5>
                                    <p className="text-[10px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                                      {proto.desc}
                                    </p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Active Conversation Messages Flow */
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${
                            msg.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {msg.sender === "ai" && (
                            <div className="w-7 h-7 rounded-xl bg-white text-black flex items-center justify-center shrink-0 mt-0.5 shadow-lg border border-white/20">
                              <img
                                src="/logo.svg"
                                alt="Fitora AI"
                                className="w-4 h-4 object-contain brightness-0"
                              />
                            </div>
                          )}

                          <div
                            className={`max-w-[85%] p-3.5 sm:p-4 rounded-2xl ${
                              msg.sender === "user"
                                ? "bg-white text-black font-semibold rounded-tr-none shadow-xl leading-relaxed"
                                : "bg-neutral-900/90 text-gray-100 border border-white/15 rounded-tl-none leading-relaxed shadow-lg whitespace-pre-line"
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span
                              className={`text-[9px] block text-right mt-1.5 font-bold ${
                                msg.sender === "user"
                                  ? "text-gray-500"
                                  : "text-gray-400"
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>

                          {msg.sender === "user" && (
                            <div className="w-7 h-7 rounded-xl bg-neutral-800 text-white border border-white/20 flex items-center justify-center shrink-0 mt-0.5 shadow-md overflow-hidden">
                              {userAvatar ? (
                                <img
                                  src={userAvatar}
                                  alt={userName}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (
                                      e.currentTarget as HTMLElement
                                    ).style.display = "none";
                                    const fallback =
                                      e.currentTarget.parentElement?.querySelector(
                                        ".user-avatar-fallback",
                                      ) as HTMLElement | null;
                                    if (fallback)
                                      fallback.style.display = "flex";
                                  }}
                                />
                              ) : null}
                              <div
                                className={`user-avatar-fallback w-full h-full ${
                                  userAvatar ? "hidden" : "flex"
                                } items-center justify-center text-[10px] font-black uppercase text-white bg-gradient-to-br from-neutral-700 to-neutral-900`}
                              >
                                {userInitial ? (
                                  userInitial
                                ) : (
                                  <User className="w-3.5 h-3.5" />
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}

                    {isTyping && (
                      <div className="flex items-center gap-3 text-gray-400 text-xs pl-1">
                        <div className="w-7 h-7 rounded-xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
                          <img
                            src="/logo.svg"
                            alt="Fitora AI"
                            className="w-4 h-4 object-contain brightness-0"
                          />
                        </div>
                        <div className="bg-neutral-900 border border-white/15 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2 shadow-md">
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                          <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                          <span className="text-[11px] font-medium text-gray-300 ml-1">
                            Calibrating fitness protocol...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Active Prompt Ribbon (With Smooth Scroll Controls on Both Sides) */}
                  {!isFreshConversation && (
                    <div className="px-2.5 py-2 bg-neutral-950/95 border-t border-white/10 flex items-center gap-1.5 shrink-0 select-none">
                      {/* Left Scroll Button */}
                      <button
                        type="button"
                        onClick={() => scrollProtocols("left")}
                        className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 shadow-sm"
                        aria-label="Scroll protocols left"
                        title="Previous protocols"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-[9px] font-black uppercase tracking-wider text-gray-400 shrink-0 px-1 hidden xs:inline">
                        Protocols:
                      </span>

                      {/* Scrollable Protocols Rail */}
                      <div
                        ref={protocolScrollRef}
                        className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none scroll-smooth py-0.5"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {COMPACT_PROMPTS.map((sug, i) => {
                          const IconComponent = sug.icon;
                          return (
                            <button
                              key={i}
                              type="button"
                              disabled={isTyping || isQuotaExhausted}
                              onClick={() => handleSendMessage(sug.query)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-white text-gray-300 hover:text-black border border-white/10 hover:border-white text-[10px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shrink-0 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              <IconComponent className="w-2.5 h-2.5" />
                              <span>{sug.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Right Scroll Button */}
                      <button
                        type="button"
                        onClick={() => scrollProtocols("right")}
                        className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white border border-white/10 flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer active:scale-90 shadow-sm"
                        aria-label="Scroll protocols right"
                        title="Next protocols"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Interactive Command Input Deck */}
                  {isQuotaExhausted ? (
                    <div className="p-3.5 sm:p-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shrink-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black uppercase text-white">
                            Daily Free Quota Reached
                          </h4>
                          <p className="text-[11px] text-gray-400 font-medium">
                            You used {quota?.plansUsed}/{quota?.plansLimit}{" "}
                            plans today. Upgrade to Pro for 10 daily plans!
                          </p>
                        </div>
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
                      className="p-3 sm:p-3.5 bg-neutral-900/95 border-t border-white/15 flex items-center gap-2 shrink-0"
                    >
                      <div className="flex-1 flex items-center gap-2 pl-4 pr-1.5 py-1.5 rounded-full bg-black border border-white/20 focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all duration-300 shadow-inner">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Ask about workout splits, macros, exercise form..."
                          className="bg-transparent text-xs sm:text-sm text-white placeholder-gray-500 outline-none w-full font-medium"
                        />
                        <button
                          type="submit"
                          disabled={!inputText.trim() || isTyping}
                          className="group w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-black disabled:bg-neutral-800 disabled:text-gray-600 flex items-center justify-center shrink-0 transition-all duration-300 shadow-lg cursor-pointer hover:scale-105 active:scale-95 disabled:cursor-not-allowed"
                          aria-label="Send Message"
                        >
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5] group-hover:rotate-45 transition-transform duration-300" />
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* ─── 2. Morphing AI Trigger Button (Notch Locked in Hero, Persistent) ─── */}
      <div
        ref={widgetRef}
        className="absolute inset-0 select-none pointer-events-none"
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className={`group flex items-center justify-center font-bold cursor-pointer transition-all duration-300 pointer-events-auto select-none ${
            isScrolled
              ? "fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-black text-white border-[3.5px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] shadow-[0_0_30px_rgba(255,255,255,0.35)] hover:scale-105 active:scale-95 z-[9999]"
              : "absolute bottom-[-2px] sm:bottom-[-2px] left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black border-[3px] border-white shadow-[0_4px_30px_rgba(0,0,0,0.95)] hover:scale-110 active:scale-95 z-[45]"
          } ${
            isOpen
              ? "ring-2 ring-white/70 shadow-[0_0_25px_rgba(255,255,255,0.6)] scale-105"
              : ""
          }`}
          aria-label="Toggle FITORA AI Studio"
        >
          {isScrolled ? (
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white stroke-none group-hover:rotate-12 transition-transform duration-300 drop-shadow-md" />
              <span className="text-[11px] sm:text-xs tracking-wide">
                {isOpen ? "Close AI" : "Ask AI"}
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Image
                src="/gemini-logo.png"
                alt="Google Gemini"
                width={36}
                height={36}
                className={`w-6 h-6 sm:w-7 sm:h-7 object-contain transition-transform duration-300 drop-shadow-[0_0_10px_rgba(66,133,244,0.5)] ${
                  isOpen ? "rotate-45 scale-110" : "group-hover:rotate-12"
                }`}
                priority
              />
            </div>
          )}
        </button>
      </div>
    </>
  );
}
