"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiActivity, FiCheckCircle } from "react-icons/fi";

export interface Message {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "ai",
    text: "Hello Moloy! I'm your AI Fitness Coach. What are your fitness goals for today?",
    timestamp: "2:22 AM",
  },
  {
    id: "2",
    sender: "user",
    text: "Hi, does my current workout plan match my calorie target?",
    timestamp: "2:23 AM",
  },
  {
    id: "3",
    sender: "ai",
    text: "In comparison, what menu item contains daily protein requirement?",
    timestamp: "2:24 AM",
  },
  {
    id: "4",
    sender: "system",
    text: "Here you can track your live stream response & recovery progress!",
    timestamp: "2:25 AM",
  },
];

export default function AiTrainerChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: input.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    // Simulate AI Coach response stream
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Great question! Regarding "${currentInput}": I recommend focusing on progressive overload and hitting 1.8g protein per kg.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-[520px] w-full max-w-md bg-[#111113] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-4 bg-[#161619] border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="AI Coach Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-red-500/80 shadow-md shadow-red-950/40"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#161619]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-base tracking-wide">
                AI Coach
              </h3>
              <FiCheckCircle className="text-blue-500 text-xs fill-blue-500/20" />
            </div>
            <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <FiActivity size={11} className="animate-pulse" /> Live Realtime Assistant
            </p>
          </div>
        </div>
      </div>

      {/* ── Message History ── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-1">
            <div
              className={`flex items-end gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* AI Avatar */}
              {msg.sender === "ai" && (
                <div className="w-6 h-6 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  AI
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] px-4 py-3 text-sm font-medium leading-snug shadow-md transition-all ${
                  msg.sender === "user"
                    ? "bg-red-600 text-white rounded-2xl rounded-tr-none shadow-red-950/40"
                    : msg.sender === "ai"
                    ? "bg-emerald-600 text-white rounded-2xl rounded-tl-none shadow-emerald-950/30"
                    : "bg-red-950/60 border border-red-800/40 text-red-200 rounded-2xl shadow-red-950/20"
                }`}
              >
                {msg.text}
              </div>

              {/* User Avatar */}
              {msg.sender === "user" && (
                <div className="w-6 h-6 rounded-full bg-red-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  M
                </div>
              )}
            </div>
            <p
              className={`text-[10px] text-white/30 px-8 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              {msg.timestamp}
            </p>
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-600/90 text-white flex items-center justify-center text-[10px] font-bold">
              AI
            </div>
            <div className="bg-emerald-950/50 border border-emerald-800/30 px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] font-medium text-emerald-300">
                AI Coach is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Suggestion Prompts ── */}
      <div className="px-4 py-2 bg-[#141416] border-t border-white/[0.05] flex gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setInput("Suggest today's workout plan")}
          className="text-xs text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1 rounded-full whitespace-nowrap transition-colors"
        >
          💪 Workout plan
        </button>
        <button
          type="button"
          onClick={() => setInput("How much protein do I need?")}
          className="text-xs text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1 rounded-full whitespace-nowrap transition-colors"
        >
          🥗 Protein target
        </button>
        <button
          type="button"
          onClick={() => setInput("Recovery advice")}
          className="text-xs text-white/60 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1 rounded-full whitespace-nowrap transition-colors"
        >
          🔥 Recovery tips
        </button>
      </div>

      {/* ── Input Box ── */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-[#161619] border-t border-white/[0.08] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your AI Trainer..."
          className="flex-1 bg-white/[0.06] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-2xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-950/60 transition-all duration-200 shrink-0"
          aria-label="Send message"
        >
          <FiSend size={16} />
        </button>
      </form>
    </div>
  );
}
