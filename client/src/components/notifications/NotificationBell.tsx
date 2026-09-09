"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CreditCard,
  FileText,
  Sparkles,
  RefreshCw,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import {
  fetchNotificationsApi,
  markNotificationAsReadApi,
  markAllNotificationsAsReadApi,
  type AppNotification,
} from "@/services/notificationService";
import { getAuthSession, AUTH_SESSION_UPDATED } from "@/services/authService";

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return "Just now";
  const now = Date.now();
  const past = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const loadNotifications = async () => {
    const session = getAuthSession();
    if (!session?.token) {
      setIsLoggedIn(false);
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoggedIn(true);
    const data = await fetchNotificationsApi(session.token);
    if (data.success) {
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleSessionUpdate = () => {
      loadNotifications();
    };

    window.addEventListener(AUTH_SESSION_UPDATED, handleSessionUpdate);
    window.addEventListener("storage", handleSessionUpdate);

    // Subtle 45s interval to check for updates
    const interval = setInterval(loadNotifications, 45000);

    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED, handleSessionUpdate);
      window.removeEventListener("storage", handleSessionUpdate);
      clearInterval(interval);
    };
  }, []);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!isLoggedIn) return null;

  const handleMarkAsRead = async (id: string, link?: string) => {
    const session = getAuthSession();
    if (session?.token) {
      await markNotificationAsReadApi(session.token, id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setIsOpen(false);
    if (link) {
      router.push(link);
    }
  };

  const handleMarkAllAsRead = async () => {
    const session = getAuthSession();
    if (!session?.token) return;
    setLoading(true);
    await markAllNotificationsAsReadApi(session.token);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    setLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "invoice":
        return <FileText className="w-3.5 h-3.5 text-white" />;
      case "upgrade":
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
      case "renewal":
        return <RefreshCw className="w-3.5 h-3.5 text-white" />;
      case "payment":
        return <CreditCard className="w-3.5 h-3.5 text-white" />;
      default:
        return <AlertCircle className="w-3.5 h-3.5 text-white" />;
    }
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      {/* ── Bell Trigger Button ── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open notifications"
        className="relative w-10 h-10 rounded-full border border-white/20 bg-neutral-900/90 hover:bg-neutral-800 hover:border-white/40 flex items-center justify-center transition-all cursor-pointer select-none"
      >
        <Bell className="w-4 h-4 text-white" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-white text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border border-black animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* ── Dropdown Panel ── */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-neutral-950 border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/60">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-white">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                disabled={loading}
                className="text-[11px] font-bold text-white/60 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center text-white/40 space-y-2">
                <Bell className="w-7 h-7 mx-auto opacity-30" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-[11px] opacity-70">
                  You are completely caught up!
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleMarkAsRead(n._id, n.link)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer select-none hover:bg-neutral-900/80 ${
                    !n.isRead ? "bg-white/[0.04]" : "opacity-80"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-neutral-900 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(n.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-black uppercase tracking-tight text-white truncate">
                        {n.title}
                      </p>
                      <span className="text-[10px] text-white/40 shrink-0 font-medium">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-white/70 leading-snug line-clamp-2">
                      {n.message}
                    </p>

                    {n.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-wider pt-0.5">
                        <span>View details</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-white shrink-0 mt-1.5 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Link */}
          <div className="p-2.5 border-t border-white/10 bg-black/40 text-center">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                router.push("/profile");
              }}
              className="text-[11px] font-black uppercase tracking-wider text-white/70 hover:text-white transition-colors cursor-pointer"
            >
              Go to Profile &amp; Billing ↗
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
