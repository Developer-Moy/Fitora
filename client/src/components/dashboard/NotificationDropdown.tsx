"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Check,
  Trash2,
  Activity,
  Dumbbell,
  Trophy,
  ShieldCheck,
  X,
} from "lucide-react";

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "workout" | "goal" | "ai" | "system";
};

const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "WORKOUT SESSION LOGGED",
    description:
      "Chest & Triceps Hypertrophy routine completed (450 kcal burned).",
    time: "10 MIN AGO",
    read: false,
    type: "workout",
  },
  {
    id: 2,
    title: "FITORA AI TELEMETRY UPDATE",
    description:
      "Daily target hydration recommendation updated to 3.5L based on climate.",
    time: "1 HOUR AGO",
    read: false,
    type: "ai",
  },
  {
    id: 3,
    title: "STRENGTH MILESTONE REACHED",
    description: "You hit 90% of your Bench Press 110kg PR goal!",
    time: "3 HOURS AGO",
    read: false,
    type: "goal",
  },
  {
    id: 4,
    title: "NATIONAL NETWORK COVERAGE",
    description: "Branch network expanded to all 64 districts nationwide.",
    time: "YESTERDAY",
    read: true,
    type: "system",
  },
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [activeFilter, setActiveFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "unread") return !n.read;
    return true;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const toggleReadStatus = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "workout":
        return <Dumbbell className="w-4 h-4 text-white" />;
      case "goal":
        return <Trophy className="w-4 h-4 text-white" />;
      case "ai":
        return <Activity className="w-4 h-4 text-white" />;
      case "system":
        return <ShieldCheck className="w-4 h-4 text-white" />;
      default:
        return <Bell className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="relative select-none" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition-all cursor-pointer ${
          isOpen
            ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            : "border-white/15 bg-neutral-900 text-white hover:bg-neutral-800 hover:border-white/30"
        }`}
        aria-label="Notifications"
      >
        <Bell className="h-4.5 w-4.5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        )}
      </button>

      {/* Dropdown Overlay Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/15 bg-neutral-950/95 backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 space-y-4">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white" />
              <h3 className="text-xs font-black uppercase tracking-wider text-white">
                NOTIFICATIONS
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-black">
                  {unreadCount} NEW
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-white/60 hover:text-white transition cursor-pointer uppercase"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition cursor-pointer ${
                activeFilter === "all"
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-white/50 border border-white/10 hover:text-white"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter("unread")}
              className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase transition cursor-pointer ${
                activeFilter === "unread"
                  ? "bg-white text-black"
                  : "bg-neutral-900 text-white/50 border border-white/10 hover:text-white"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleReadStatus(item.id)}
                  className={`group relative p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    item.read
                      ? "bg-neutral-950 border-white/5 opacity-60 hover:opacity-100"
                      : "bg-neutral-900 border-white/15 hover:border-white/30"
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-black uppercase text-white truncate tracking-tight">
                        {item.title}
                      </h4>
                      <span className="text-[8px] font-bold text-white/40 shrink-0">
                        {item.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/70 leading-snug font-medium">
                      {item.description}
                    </p>
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-white shrink-0 mt-1 shadow-[0_0_6px_white]" />
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs font-bold uppercase text-white/40">
                No notifications to display
              </div>
            )}
          </div>

          {/* Footer Controls */}
          {notifications.length > 0 && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] font-bold text-white/40 hover:text-white flex items-center gap-1 transition cursor-pointer uppercase"
              >
                <Trash2 className="w-3 h-3" /> Clear all
              </button>

              <span className="text-[9px] font-bold text-white/30 tracking-widest uppercase">
                FITORA NOTIFICATIONS
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
