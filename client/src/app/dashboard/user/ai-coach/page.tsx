"use client";

import { Bot, Send, Sparkles, User, Dumbbell, Flame } from "lucide-react";
import { useState } from "react";

export default function UserAiCoachPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am FITORA AI, your personal fitness & nutrition intelligence assistant. How can I optimize your workout routine or diet today?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: `Based on your telemetry profile, for "${currentInput}", I recommend focusing on progressive overload with 8-12 reps per set, keeping rest periods under 60 seconds for peak muscle hypertrophy.`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="space-y-6 select-none font-sans max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
            AI FITNESS SUITE
          </p>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">
          FITORA AI COACH
        </h1>
        <p className="mt-1 text-xs text-white/50">
          Get real-time workout recommendations, macro suggestions, and form
          guidance from your AI assistant.
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-2xl border border-white/10 bg-neutral-950 p-5 h-[460px] flex flex-col justify-between shadow-xl">
        <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                  msg.sender === "user"
                    ? "bg-white text-black"
                    : "bg-neutral-800 text-white border border-white/20"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs leading-relaxed max-w-md ${
                  msg.sender === "user"
                    ? "bg-white text-black font-bold"
                    : "bg-neutral-900 text-white/80 border border-white/10"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="relative mt-4">
          <input
            type="text"
            placeholder="Ask FITORA AI about workouts, calories, form..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-neutral-900 border border-white/15 rounded-full py-3.5 pl-5 pr-12 text-xs font-bold text-white placeholder:text-white/30 outline-none focus:border-white transition"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-100 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </form>
      </div>
    </div>
  );
}
