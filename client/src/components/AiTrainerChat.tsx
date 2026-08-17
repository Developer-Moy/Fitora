"use client";

import { useState, useRef, useEffect } from "react";
import { FiSend, FiCheckCircle } from "react-icons/fi";

export interface Message {
  id: string;
  sender: "user" | "ai" | "system";
  text: string;
  timestamp: string;
  avatar?: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "user",
    text: "Hi, does your message write your recovery and your nutrition progress?",
    timestamp: "2:23 AM",
  },
  {
    id: "2",
    sender: "ai",
    text: "In comparison, what menu item contains daily protein requirement?",
    timestamp: "2:24 AM",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: "3",
    sender: "system",
    text: "Here you tracking recovery progress and nutrition status in realtime!",
    timestamp: "2:25 AM",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
  },
];

export default function AiTrainerChat() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputPrompt.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    const sentText = inputPrompt;
    setInputPrompt("");
    setIsTyping(true);

    setTimeout(() => {
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: `Based on your request "${sentText}", your daily macros and recovery index are optimal!`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
      {/* ── Left Card: AI Prompt Box (Matching Design Mockup) ── */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between h-[360px] shadow-xl">
        <div className="flex-1 flex flex-col">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask your AI Trainer..."
            className="w-full flex-1 bg-transparent text-white placeholder-white/40 text-base resize-none focus:outline-none leading-relaxed font-medium"
          />
        </div>

        {/* Bottom Send Action */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
          <span className="text-xs text-white/30">
            Powered by Fitora AI Engine
          </span>
          <button
            onClick={handleSendPrompt}
            disabled={!inputPrompt.trim()}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-red-600 text-white flex items-center gap-2 text-sm font-semibold shadow-lg shadow-red-950/50 transition-all duration-200"
          >
            <span>Send</span>
            <FiSend size={14} />
          </button>
        </div>
      </div>

      {/* ── Right Card: AI Chat History Stream Container (Matching Mockup) ── */}
      <div className="bg-[#141416] border border-white/[0.08] rounded-2xl p-5 flex flex-col justify-between h-[360px] shadow-xl overflow-hidden">
        {/* Header: AI Coach Verified */}
        <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.06]">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
            alt="AI Coach Avatar"
            className="w-8 h-8 rounded-full object-cover border border-blue-500/50"
          />
          <div className="flex items-center gap-1.5">
            <h4 className="font-bold text-white text-sm">AI Coach</h4>
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
              ✓
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 scrollbar-thin">
          <p className="text-[11px] text-center text-white/30 font-medium my-1">
            2:23 AM
          </p>

          {messages.map((msg) => (
            <div key={msg.id} className="space-y-1">
              {/* User Bubble - Crimson Red */}
              {msg.sender === "user" && (
                <div className="flex justify-end">
                  <div className="bg-red-600 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl max-w-[85%] leading-relaxed shadow-md shadow-red-950/30">
                    {msg.text}
                  </div>
                </div>
              )}

              {/* AI Bubble - Emerald Green */}
              {msg.sender === "ai" && (
                <div className="flex items-end gap-2 justify-start">
                  {msg.avatar && (
                    <img
                      src={msg.avatar}
                      alt="AI Avatar"
                      className="w-5 h-5 rounded-full object-cover border border-emerald-400/50 mb-0.5"
                    />
                  )}
                  <div className="bg-emerald-600 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl max-w-[85%] leading-relaxed shadow-md shadow-emerald-950/30">
                    {msg.text}
                  </div>
                </div>
              )}

              {/* System / Recovery Bubble - Deep Dark Red */}
              {msg.sender === "system" && (
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-red-950/80 border border-red-800/40 text-red-200 text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl max-w-[85%] leading-relaxed shadow-md shadow-red-950/20">
                    {msg.text}
                  </div>
                  {msg.avatar && (
                    <img
                      src={msg.avatar}
                      alt="User Avatar"
                      className="w-5 h-5 rounded-full object-cover border border-red-500/50 mb-0.5"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="bg-emerald-950/40 border border-emerald-800/30 px-3.5 py-2 rounded-xl text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-emerald-300 ml-1">AI Coach is writing...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>
    </div>
  );
}
