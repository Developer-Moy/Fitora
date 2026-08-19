"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiCpu, FiUserCheck, FiZap, FiActivity, FiMessageSquare, FiTrendingUp } from "react-icons/fi";

export interface ChatMessage {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  avatar?: string;
}

const AI_CHAT_PROMPTS = [
  "How to improve muscle recovery sleep?",
  "How much water should I drink daily?",
  "What is the best warm-up before lifting?",
  "Tips for preventing delayed onset muscle soreness (DOMS)?",
];

const AI_TRAINER_PROMPTS = [
  "Build me a Chest & Push workout split",
  "Calculate macro ratio for protein gain",
  "Best high-protein meal post workout",
  "How to progressively overload back squats?",
];

const INITIAL_AI_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: "c1",
    sender: "ai",
    text: "Hello! I am your Fitora General AI Assistant. Ask me anything about recovery, hydration, sleep, or daily wellness habits!",
    timestamp: "10:00 AM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "c2",
    sender: "user",
    text: "How can I improve my recovery sleep after intense leg day?",
    timestamp: "10:01 AM",
  },
  {
    id: "c3",
    sender: "ai",
    text: "For optimal sleep recovery after leg day: keep room temp around 18°C (65°F), hydrate with electrolytes, consume 30g slow-digesting casein protein before sleep, and avoid blue light 1 hour prior to bed.",
    timestamp: "10:02 AM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
];

const INITIAL_AI_TRAINER_MESSAGES: ChatMessage[] = [
  {
    id: "t1",
    sender: "ai",
    text: "Welcome to AI Trainer Studio! I specialize in target workout splits, set/rep schemes, and micro-nutrition calculations.",
    timestamp: "10:00 AM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "t2",
    sender: "user",
    text: "Can you recommend a hyper-trophy Chest & Triceps routine?",
    timestamp: "10:03 AM",
  },
  {
    id: "t3",
    sender: "ai",
    text: "Here is a hypertrophy focus: 4x8 Barbell Bench Press, 3x10 Incline Dumbbell Flyes, 3x12 Dips (bodyweight/weighted), and 3x15 Overhead Cable Triceps Extensions. Rest 90s between compound sets!",
    timestamp: "10:04 AM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "t4",
    sender: "system",
    text: "🔥 System Alert: Targeted protein recommendation is 160g daily based on your active goals.",
    timestamp: "10:05 AM",
  },
];

// Helper to call backend API with fallback mock response
async function fetchAiChatResponse(promptText: string, mode: "chat" | "trainer"): Promise<string> {
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
  } catch (_error) {
    // Silent catch, fallback to dynamic mock response below
  }

  // Dynamic fallback responses based on prompt keyword matching
  const lower = promptText.toLowerCase();
  if (mode === "chat") {
    if (lower.includes("sleep") || lower.includes("recovery")) {
      return "Prioritize 7-9 hours of deep sleep, take 300mg Magnesium Glycinate, and spend 10 minutes foam-rolling before bed to increase HRV!";
    }
    if (lower.includes("water") || lower.includes("hydrate")) {
      return "Aim for 3.5 Liters of water per day, plus 500ml for every 45 minutes of heavy workout session with essential sodium & potassium!";
    }
    if (lower.includes("warm") || lower.includes("stretch")) {
      return "Perform 5-10 mins dynamic movements: arm circles, leg swings, hip openers, and light warm-up sets (40% 1RM) before heavy loading.";
    }
    return `Great fitness question! Regarding "${promptText}", maintaining strict consistency in sleep, hydration, and progressive overload yields 90% of your long-term athletic results.`;
  } else {
    if (lower.includes("chest") || lower.includes("push")) {
      return "Chest & Push Focus: 4x8 Flat Bench Press, 3x10 Incline DB Press, 3x12 Cable Flyes, and 4x12 Cable Tricep Pushdowns. Progressive overload + 2.5kg weekly!";
    }
    if (lower.includes("macro") || lower.includes("protein") || lower.includes("diet")) {
      return "Macro Goal: Aim for 2.0g protein/kg body weight, 40% carbs around your workout window, and 20-25% healthy fats for optimal hormone output.";
    }
    if (lower.includes("back") || lower.includes("squat") || lower.includes("leg")) {
      return "Leg & Back Power: 4x6 Barbell Squats, 4x8 Romanian Deadlifts, 3x10 Lat Pulldowns, and 3x12 Seated Cable Rows. Focus on slow 3-second eccentrics!";
    }
    return `AI Trainer Analysis for "${promptText}": Recommend structured 4-day split (Upper/Lower/Push/Pull), keeping 1-2 reps in reserve (RIR 1-2) per set.`;
  }
}

export default function AiTrainerSection() {
  const [activeTab, setActiveTab] = useState<"all" | "chat" | "trainer">("all");

  // AI Chat Widget state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_AI_CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // AI Trainer Widget state
  const [trainerMessages, setTrainerMessages] = useState<ChatMessage[]>(INITIAL_AI_TRAINER_MESSAGES);
  const [trainerInput, setTrainerInput] = useState("");
  const [isTrainerTyping, setIsTrainerTyping] = useState(false);
  const trainerEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatTyping]);

  useEffect(() => {
    trainerEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [trainerMessages, isTrainerTyping]);

  const handleSendChat = async (promptText?: string) => {
    const textToSend = promptText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!promptText) setChatInput("");
    setIsChatTyping(true);

    const aiReplyText = await fetchAiChatResponse(textToSend, "chat");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      };
      setChatMessages((prev) => [...prev, aiMsg]);
      setIsChatTyping(false);
    }, 600);
  };

  const handleSendTrainer = async (promptText?: string) => {
    const textToSend = promptText || trainerInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setTrainerMessages((prev) => [...prev, userMsg]);
    if (!promptText) setTrainerInput("");
    setIsTrainerTyping(true);

    const aiReplyText = await fetchAiChatResponse(textToSend, "trainer");

    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      };
      setTrainerMessages((prev) => [...prev, aiMsg]);
      setIsTrainerTyping(false);
    }, 600);
  };

  return (
    <section id="ai-trainer" className="w-full py-20 px-4 sm:px-6 md:px-10 bg-[#0b0c0e] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <FiCpu className="w-3.5 h-3.5 animate-pulse" />
            <span>Your AI Fitness Coach</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Intelligent Fitness & Workout Studio
          </h2>
          <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto">
            Get instant, personalized workout routines, nutrition macro targets, and recovery advice powered by Fitora AI.
          </p>

          {/* View Toggle Bar */}
          <div className="pt-4 flex items-center justify-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                activeTab === "all"
                  ? "bg-white/10 text-white border border-white/20 shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              Side-by-Side View
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "chat"
                  ? "bg-emerald-600 text-white border border-emerald-500 shadow-lg shadow-emerald-950/40"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FiMessageSquare size={14} />
              <span>AI Chat Assistant</span>
            </button>
            <button
              onClick={() => setActiveTab("trainer")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === "trainer"
                  ? "bg-red-600 text-white border border-red-500 shadow-lg shadow-red-950/40"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <FiZap size={14} />
              <span>AI Workout Specialist</span>
            </button>
          </div>
        </div>

        {/* Dual Chat Widgets Container */}
        <div
          className={`grid gap-8 ${
            activeTab === "all"
              ? "grid-cols-1 lg:grid-cols-2"
              : "grid-cols-1 max-w-4xl mx-auto"
          }`}
        >
          
          {/* ════════════════════════════════════════════════════════════════
              WIDGET 1: AI Chat Assistant (General Fitness & Q&A)
             ════════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "chat") && (
            <div className="bg-[#141416] border border-white/[0.08] rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[540px] shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-emerald-500/30 transition-all duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FiMessageSquare size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">AI Fitness Assistant</h3>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold">
                        General Q&A
                      </span>
                    </div>
                    <p className="text-xs text-white/40">Recovery, sleep, hydration & wellness</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Online</span>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[11px] text-white/40 shrink-0 font-medium">Try:</span>
                {AI_CHAT_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(prompt)}
                    className="shrink-0 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-emerald-500/20 border border-white/[0.08] hover:border-emerald-500/30 text-white/70 hover:text-emerald-300 text-xs transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Stream Area */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    {msg.sender === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed shadow-md shadow-emerald-950/30">
                          {msg.text}
                          <div className="text-[10px] text-emerald-200/60 text-right mt-1 font-normal">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 justify-start">
                        <img
                          src={msg.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                          alt="AI Avatar"
                          className="w-7 h-7 rounded-full object-cover border border-emerald-400/50 mt-1 shrink-0"
                        />
                        <div className="bg-white/[0.06] border border-white/[0.08] text-white/90 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-md">
                          {msg.text}
                          <div className="text-[10px] text-white/40 mt-1 font-normal">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isChatTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-950/40 border border-emerald-800/30 px-3.5 py-2 rounded-xl text-xs text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-emerald-300 ml-1">AI Assistant is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="pt-3 border-t border-white/[0.06] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask any general fitness question..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white flex items-center gap-2 text-sm font-semibold transition-all duration-200 shadow-lg shadow-emerald-950/40"
                >
                  <FiSend size={15} />
                </button>
              </form>
            </div>
          )}

          {/* ════════════════════════════════════════════════════════════════
              WIDGET 2: AI Trainer Specialist (Workouts & Nutrition)
             ════════════════════════════════════════════════════════════════ */}
          {(activeTab === "all" || activeTab === "trainer") && (
            <div className="bg-[#141416] border border-white/[0.08] rounded-3xl p-5 sm:p-6 flex flex-col justify-between h-[540px] shadow-2xl relative overflow-hidden backdrop-blur-xl group hover:border-red-500/30 transition-all duration-300">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                    <FiZap size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">AI Workout & Macro Specialist</h3>
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-semibold">
                        Coach Mode
                      </span>
                    </div>
                    <p className="text-xs text-white/40">Exercise routines, sets, reps & meal plans</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20 font-semibold">
                  <FiTrendingUp size={13} />
                  <span>PRO AI</span>
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="py-2 flex items-center gap-2 overflow-x-auto scrollbar-none">
                <span className="text-[11px] text-white/40 shrink-0 font-medium">Try:</span>
                {AI_TRAINER_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendTrainer(prompt)}
                    className="shrink-0 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-red-500/20 border border-white/[0.08] hover:border-red-500/30 text-white/70 hover:text-red-300 text-xs transition-all duration-200"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Message Stream Area */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
                {trainerMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    {msg.sender === "user" ? (
                      <div className="flex justify-end">
                        <div className="bg-red-600 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl rounded-tr-none max-w-[85%] leading-relaxed shadow-md shadow-red-950/30">
                          {msg.text}
                          <div className="text-[10px] text-red-200/60 text-right mt-1 font-normal">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    ) : msg.sender === "system" ? (
                      <div className="flex justify-center my-1">
                        <div className="bg-red-950/60 border border-red-800/40 text-red-200 text-xs font-medium px-3.5 py-2 rounded-xl text-center max-w-[90%] shadow-md">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5 justify-start">
                        <img
                          src={msg.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"}
                          alt="AI Coach Avatar"
                          className="w-7 h-7 rounded-full object-cover border border-red-400/50 mt-1 shrink-0"
                        />
                        <div className="bg-white/[0.06] border border-white/[0.08] text-white/90 text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl rounded-tl-none max-w-[85%] leading-relaxed shadow-md">
                          {msg.text}
                          <div className="text-[10px] text-white/40 mt-1 font-normal">
                            {msg.timestamp}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isTrainerTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-red-950/40 border border-red-800/30 px-3.5 py-2 rounded-xl text-xs text-red-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] text-red-300 ml-1">AI Coach is designing routine...</span>
                    </div>
                  </div>
                )}
                <div ref={trainerEndRef} />
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendTrainer();
                }}
                className="pt-3 border-t border-white/[0.06] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={trainerInput}
                  onChange={(e) => setTrainerInput(e.target.value)}
                  placeholder="Ask for workout routines or macro plans..."
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] focus:border-red-500/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!trainerInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white flex items-center gap-2 text-sm font-semibold transition-all duration-200 shadow-lg shadow-red-950/40"
                >
                  <FiSend size={15} />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
