"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Cpu,
  Send,
  User,
  Zap,
  TrendingUp,
  Activity,
  RefreshCw,
  Copy,
  Check,
  Dumbbell,
  Apple,
  Moon,
  Flame,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  category?: "workout" | "nutrition" | "recovery" | "general";
}

const PRESET_PROMPTS = [
  {
    icon: Dumbbell,
    label: "Chest & Push Routine",
    prompt: "Build me a high-intensity Hypertrophy Chest & Triceps workout routine with set/rep details.",
    category: "workout" as const,
  },
  {
    icon: Apple,
    label: "Calculate Macros",
    prompt: "How much protein, carbs, and fats should I eat daily for muscle gain at 75kg body weight?",
    category: "nutrition" as const,
  },
  {
    icon: Moon,
    label: "DOMS Recovery Tips",
    prompt: "What are the most effective ways to recover quickly from severe leg day soreness (DOMS)?",
    category: "recovery" as const,
  },
  {
    icon: Flame,
    label: "Progressive Overload",
    prompt: "Explain how to apply progressive overload to Bench Press when hitting a plateau.",
    category: "workout" as const,
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "ai",
    text: "Welcome to your Personal AI Fitness Studio! I am your Fitora AI Coach. Ask me anything about custom workout splits, progressive overload, macro calculations, or recovery strategies.",
    timestamp: "10:00 AM",
    category: "general",
  },
  {
    id: "m2",
    sender: "user",
    text: "How should I structure my weekly workout split for optimal muscle growth?",
    timestamp: "10:01 AM",
    category: "workout",
  },
  {
    id: "m3",
    sender: "ai",
    text: "For optimal hypertrophy, a 4 or 5-day Push/Pull/Legs (PPL) or Upper/Lower split works best! This allows each muscle group to be trained 2x per week with 48 hours of recovery in between. Would you like a detailed 4-day Upper/Lower routine?",
    timestamp: "10:02 AM",
    category: "workout",
  },
];

async function fetchAiCoachResponse(promptText: string): Promise<string> {
  try {
    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.responseText) {
        return data.data.responseText;
      }
    }
  } catch (_err) {
    // Silent fallback
  }

  // Dynamic fallback responses based on keywords
  const lower = promptText.toLowerCase();
  if (lower.includes("chest") || lower.includes("push")) {
    return "🔥 **Hypertrophy Chest & Triceps Focus:**\n\n1. **Barbell Bench Press:** 4 sets × 6-8 reps (90s rest)\n2. **Incline DB Press:** 3 sets × 10-12 reps (60s rest)\n3. **Cable Chest Flyes:** 3 sets × 12-15 reps (45s rest)\n4. **Weighted Dips:** 3 sets × 8-10 reps\n5. **Tricep Rope Pushdowns:** 4 sets × 12-15 reps\n\n*Tip: Focus on a 3-second negative (eccentric) phase on every rep!*";
  }
  if (lower.includes("protein") || lower.includes("macro") || lower.includes("diet")) {
    return "🥗 **Target Macro Breakdown (for 75kg athlete):**\n\n• **Protein:** 165g / day (2.2g per kg)\n• **Carbohydrates:** 300g / day (fuel for heavy lifting)\n• **Fats:** 65g / day (essential for hormone production)\n• **Total Target Energy:** ~2,450 kcal / day\n\n*Drink at least 3.5L of water and split protein into 4 equal meals of ~40g.*";
  }
  if (lower.includes("doms") || lower.includes("recover") || lower.includes("sore")) {
    return "⚡ **Rapid DOMS Recovery Protocol:**\n\n1. **Sleep:** Aim for 8-9 hours of continuous deep sleep.\n2. **Hydration:** Consume 3.5L water + electrolyte minerals (Sodium, Potassium, Magnesium).\n3. **Active Recovery:** 15-20 min light walking or stationary cycling to increase blood flow.\n4. **Nutrition:** 30g slow-digesting Casein protein before bed + 5g Glutamine.";
  }
  return `💪 **AI Coach Insight for "${promptText}":**\n\nConsistency in progressive overload, combined with 2.0g+ protein per kg of body weight and 8 hours of quality sleep, drives 95% of all physical transformation. Keep tracking your sets in Fitora!`;
}

export default function AiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputPrompt("");
    setIsTyping(true);

    const replyText = await fetchAiCoachResponse(textToSend);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#141416] border border-white/[0.08] rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-400" /> AI Coach Studio Pro
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive AI Fitness Coach & Realtime Studio
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl">
            Get instant, personalized workout splits, macro calculations, and recovery recommendations powered by Fitora AI Engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-semibold shadow-inner">
            <Cpu className="w-4 h-4 text-emerald-400" /> Multi-AI Active
          </div>
        </div>
      </div>

      {/* Preset Quick-Prompt Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-red-500" /> Preset Studio Prompts
          </span>
          <span className="text-[11px] text-white/30">Click to send prompt instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PROMPTS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#141416] border border-white/[0.08] hover:border-red-500/40 hover:bg-white/[0.04] text-left transition-all duration-200 group active:scale-98 shadow-md"
              >
                <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors duration-200 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-white/40 truncate mt-0.5">
                    {item.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Chat Container */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-3xl p-4 sm:p-6 flex flex-col justify-between min-h-[550px] max-h-[700px] shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Chat Stream Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Fitora AI Master Coach</h3>
                <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                  PRO Engine
                </span>
              </div>
              <p className="text-xs text-white/40">Realtime Workout & Nutrition Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-white/10"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Session</span>
          </button>
        </div>

        {/* Messages History Box */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 my-2 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              {msg.sender === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-red-600 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl rounded-tr-none max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-lg shadow-red-950/40">
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="text-[10px] text-red-200/60 text-right mt-1.5 font-normal">
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.08] text-white/90 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl rounded-tl-none max-w-[85%] sm:max-w-[75%] leading-relaxed shadow-md relative group">
                    <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                    
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/[0.04]">
                      <span className="text-[10px] text-white/40 font-normal">
                        {msg.timestamp}
                      </span>
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="text-white/40 hover:text-white transition-colors p-1 rounded hover:bg-white/10 flex items-center gap-1 text-[10px]"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-red-950/30 border border-red-800/30 px-4 py-2.5 rounded-2xl text-xs text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-red-300 font-medium ml-1">AI Coach is generating workout plan...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Prompt Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-3 border-t border-white/[0.06] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask your AI Coach for workout routines, macros, or recovery advice..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-red-500/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-all duration-200"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center gap-2 text-sm font-bold transition-all duration-200 shadow-lg shadow-red-950/50 shrink-0 active:scale-95"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
