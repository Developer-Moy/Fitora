"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Bot,
  Cpu,
  Send,
  User,
  Zap,
  RefreshCw,
  Copy,
  Check,
  Dumbbell,
  Apple,
  Moon,
  Flame,
  Mic,
  MicOff,
  Download,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  MessageSquareText,
} from "lucide-react";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  category?: "workout" | "nutrition" | "recovery" | "overload" | "general";
  isBookmarked?: boolean;
  suggestedFollowups?: string[];
}

const PRESET_CATEGORIES = [
  { id: "all", label: "All Prompts" },
  { id: "workout", label: "Workout Splits" },
  { id: "nutrition", label: "Nutrition & Macros" },
  { id: "recovery", label: "DOMS Recovery" },
  { id: "overload", label: "Overload Strategy" },
];

const PRESET_PROMPTS = [
  {
    icon: Dumbbell,
    label: "Chest & Push Split",
    prompt: "Build me a high-intensity Hypertrophy Chest & Triceps workout routine with set/rep details.",
    category: "workout",
  },
  {
    icon: Apple,
    label: "Calculate Macros",
    prompt: "How much protein, carbs, and fats should I eat daily for muscle gain at 75kg body weight?",
    category: "nutrition",
  },
  {
    icon: Moon,
    label: "DOMS Recovery Tips",
    prompt: "What are the most effective ways to recover quickly from severe leg day soreness (DOMS)?",
    category: "recovery",
  },
  {
    icon: Flame,
    label: "Progressive Overload",
    prompt: "Explain how to apply progressive overload to Bench Press when hitting a strength plateau.",
    category: "overload",
  },
  {
    icon: Dumbbell,
    label: "5-Day Push Pull Legs",
    prompt: "Give me a complete 5-day Push-Pull-Legs (PPL) workout split routine.",
    category: "workout",
  },
  {
    icon: Apple,
    label: "Pre-Workout Nutrition",
    prompt: "What are the best pre-workout meals for maximum energy 1 hour before heavy lifting?",
    category: "nutrition",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "ai",
    text: "Welcome to your Personal AI Fitness Studio! I am your Fitora AI Master Coach. Ask me anything about custom workout splits, progressive overload, macro calculations, or recovery strategies.",
    timestamp: "10:00 AM",
    category: "general",
    suggestedFollowups: [
      "Build me a 4-day Upper/Lower split",
      "Calculate my daily protein requirement",
      "How to fix lower back pain from deadlifts?",
    ],
  },
];

async function fetchAiCoachResponse(promptText: string): Promise<{ text: string; followups: string[] }> {
  try {
    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promptText }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data?.responseText) {
        return {
          text: data.data.responseText,
          followups: [
            "Want a 5-day routine based on this?",
            "How should I adjust calories on rest days?",
            "What supplements complement this strategy?",
          ],
        };
      }
    }
  } catch (_err) {
    // Fallback response
  }

  const lower = promptText.toLowerCase();
  if (lower.includes("chest") || lower.includes("push")) {
    return {
      text: "🔥 **Hypertrophy Chest & Triceps Focus:**\n\n1. **Barbell Bench Press:** 4 sets × 6-8 reps (90s rest)\n2. **Incline DB Press:** 3 sets × 10-12 reps (60s rest)\n3. **Cable Chest Flyes:** 3 sets × 12-15 reps (45s rest)\n4. **Weighted Dips:** 3 sets × 8-10 reps\n5. **Tricep Rope Pushdowns:** 4 sets × 12-15 reps\n\n*Tip: Focus on a 3-second negative (eccentric) phase on every rep!*",
      followups: ["Give me a Tricep-heavy finisher exercise", "What should I eat post-workout?"],
    };
  }
  if (lower.includes("protein") || lower.includes("macro") || lower.includes("diet")) {
    return {
      text: "🥗 **Target Macro Breakdown (for 75kg athlete):**\n\n• **Protein:** 165g / day (2.2g per kg)\n• **Carbohydrates:** 300g / day (fuel for heavy lifting)\n• **Fats:** 65g / day (essential for hormone production)\n• **Total Target Energy:** ~2,450 kcal / day\n\n*Drink at least 3.5L of water and split protein into 4 equal meals of ~40g.*",
      followups: ["What are cheap high-protein food sources?", "How much protein before bed?"],
    };
  }
  if (lower.includes("doms") || lower.includes("recover") || lower.includes("sore")) {
    return {
      text: "⚡ **Rapid DOMS Recovery Protocol:**\n\n1. **Sleep:** Aim for 8-9 hours of continuous deep sleep.\n2. **Hydration:** Consume 3.5L water + electrolyte minerals (Sodium, Potassium, Magnesium).\n3. **Active Recovery:** 15-20 min light walking or stationary cycling to increase blood flow.\n4. **Nutrition:** 30g slow-digesting Casein protein before bed + 5g Glutamine.",
      followups: ["Does foam rolling help with DOMS?", "Should I workout while still sore?"],
    };
  }

  return {
    text: `💪 **AI Coach Insight for "${promptText}":**\n\nConsistency in progressive overload, combined with 2.0g+ protein per kg of body weight and 8 hours of quality sleep, drives 95% of all physical transformation. Keep tracking your sets in Fitora!`,
    followups: ["How do I track my progressive overload?", "Create a custom 3-day split"],
  };
}

export default function AiCoachPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Speech-to-Text Voice Input using Web Speech API
  const handleToggleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (_err) {
      setIsListening(false);
    }
  };

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

    const { text: replyText, followups } = await fetchAiCoachResponse(textToSend);

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedFollowups: followups,
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

  const handleToggleBookmark = (id: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, isBookmarked: !msg.isBookmarked } : msg))
    );
  };

  const handleExportRoutine = () => {
    const content = messages
      .map((m) => `### [${m.timestamp}] ${m.sender.toUpperCase()}\n${m.text}\n`)
      .join("\n---\n\n");

    const blob = new Blob([`# FITORA AI COACH ROUTINE TRANSCRIPT\n\n${content}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fitora-ai-routine-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredPrompts =
    selectedCategory === "all"
      ? PRESET_PROMPTS
      : PRESET_PROMPTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-2 sm:px-4">
      {/* Top Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-[#141416] border border-white/[0.08] rounded-3xl shadow-2xl backdrop-blur-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-red-400" /> AI Coach Studio Pro
            </span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Online Stream
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive AI Fitness Coach & Realtime Studio
          </h1>
          <p className="text-xs sm:text-sm text-white/60 max-w-2xl">
            Get instant, personalized workout splits, macro calculations, and recovery recommendations powered by Fitora AI Engine.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportRoutine}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs text-white font-semibold shadow-md transition-all cursor-pointer"
            title="Export chat routine transcript as Markdown"
          >
            <Download className="w-4 h-4 text-red-400" /> Export Routine
          </button>
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-emerald-400 font-semibold">
            <Cpu className="w-4 h-4 text-emerald-400" /> Gemini Engine
          </div>
        </div>
      </div>

      {/* Category Filtering Tabs & Preset Prompt Chips */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-red-500" /> Studio Prompt Categories
          </span>
          <span className="text-[11px] text-white/30">Select category or click prompt</span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {PRESET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-red-600 text-white shadow-lg shadow-red-950/40 scale-102"
                  : "bg-[#141416] text-white/60 border border-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Filtered Preset Chips Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredPrompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.prompt)}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#141416] border border-white/[0.08] hover:border-red-500/40 hover:bg-white/[0.04] text-left transition-all duration-200 group active:scale-98 shadow-md cursor-pointer"
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
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Session</span>
          </button>
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2 my-2 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
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
                  <div className="space-y-2 max-w-[85%] sm:max-w-[75%]">
                    <div className="bg-white/[0.05] border border-white/[0.08] text-white/90 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl rounded-tl-none leading-relaxed shadow-md relative group">
                      <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
                      
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/[0.04]">
                        <span className="text-[10px] text-white/40 font-normal">
                          {msg.timestamp}
                        </span>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleToggleBookmark(msg.id)}
                            className="text-white/40 hover:text-amber-400 transition-colors p-1 rounded flex items-center gap-1 text-[10px] cursor-pointer"
                            title="Bookmark response"
                          >
                            {msg.isBookmarked ? (
                              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            ) : (
                              <Bookmark className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-white/40 hover:text-white transition-colors p-1 rounded flex items-center gap-1 text-[10px] cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400 font-bold">Copied</span>
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

                    {/* Suggested Next Questions (Follow-ups) */}
                    {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="space-y-1.5 pl-1">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquareText className="w-3 h-3 text-red-400" /> Suggested Follow-ups
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowups.map((question, qIdx) => (
                            <button
                              key={qIdx}
                              onClick={() => handleSendMessage(question)}
                              className="text-[11px] bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer hover:scale-102"
                            >
                              <span>{question}</span>
                              <ChevronRight className="w-3 h-3 text-red-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
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
                <span className="text-xs text-red-300 font-medium ml-1">AI Coach is generating response...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Prompt Form with Voice Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-3 border-t border-white/[0.06] flex items-center gap-2 sm:gap-3"
        >
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={`p-3 rounded-2xl border transition-all duration-200 shrink-0 cursor-pointer ${
              isListening
                ? "bg-red-600 text-white border-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08]"
            }`}
            title={isListening ? "Listening... Click to stop" : "Click for Voice Input"}
          >
            {isListening ? <MicOff className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={
              isListening
                ? "Listening to your voice prompt..."
                : "Ask AI Coach for workout routines, macros, or recovery advice..."
            }
            className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-red-500/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none transition-all duration-200"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center gap-2 text-sm font-bold transition-all duration-200 shadow-lg shadow-red-950/50 shrink-0 active:scale-95 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
