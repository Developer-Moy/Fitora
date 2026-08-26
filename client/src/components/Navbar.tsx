"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Search as FiSearch,
  CreditCard as FiCreditCard,
  HelpCircle as FiHelpCircle,
  Settings as FiSettings,
  ChevronDown as FiChevronDown,
  Menu as FiSidebar,
  CheckCircle2 as FiCheckCircle,
  Activity as FiActivity,
  Clock as FiClock,
  MessageSquare as FiMessageSquare,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

/* ── Main Menu Items (Mobile & Tablet Drawer) ── */
const MENU_ITEMS = [
  { label: "Chats", href: "/", icon: FiMessageSquare },
  { label: "Updates & FAQ", href: "/#about", icon: FiHelpCircle },
  { label: "Dashboard", href: "/dashboard", icon: FiSettings },
];

/* ── Collapsible "Chat list" Items ── */
const CHAT_LIST = [
  { label: "BMI Calculator", href: "/calculator", icon: FiActivity },
  { label: "Gym Stopwatch", href: "/stopwatch", icon: FiClock },
  { label: "Meal Plans", href: "/meals", icon: FiCreditCard },
  { label: "Exercise Library", href: "/exercises", icon: FiActivity },
];

/* ── Desktop / PC Horizontal Navigation Links (Centered in Middle) ── */
const DESKTOP_LINKS = [
  { label: "BMI Calculator", href: "/calculator" },
  { label: "Gym Stopwatch", href: "/stopwatch" },
  { label: "Meal Plans", href: "/meals" },
  { label: "Exercise Library", href: "/exercises" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(true);

  const { data: authSession } = useSession();
  const isLoggedIn = !!authSession?.user;

  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  return (
    <>
      {/* ── Navbar Container ── */}
      <nav className="fixed top-0 left-0 right-0 z-[70] bg-black text-white border-b border-white/10 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-8 lg:px-16 select-none">
        {/* Left: Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group select-none shrink-0"
        >
          <img
            src="/logo.svg"
            alt="Fitora logo"
            className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
          />
          <div className="flex flex-col">
            <span className="text-white font-black text-lg sm:text-xl tracking-wider uppercase leading-none font-sans">
              FITORA
            </span>
            <span className="text-[9px] text-gray-400 font-bold tracking-[0.25em] uppercase">
              GYM & AI
            </span>
          </div>
        </Link>

        {/* ── PC / Desktop Navigation (Perfectly Centered in Middle) ── */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-9 absolute left-1/2 -translate-x-1/2">
          {DESKTOP_LINKS.map(({ label, href }) => {
            const isActive =
              pathname === href || (href === "/" && pathname === "/");
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`text-xs xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-white font-extrabold"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right Side Actions ── */}
        <div className="flex items-center gap-4 shrink-0">
          {/* PC Desktop CTA Button */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="hidden lg:inline-flex group items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-xl"
            >
              <span>Join Now</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="hidden lg:inline-flex group items-center gap-2 bg-neutral-900 border border-white/20 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-xl"
            >
              <span>Dashboard</span>
              <span className="bg-white text-black group-hover:bg-black group-hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          )}

          {/* Mobile & Tablet Hamburger Toggle Button (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors duration-200 lg:hidden cursor-pointer shrink-0 p-2 rounded-xl bg-white/10 border border-white/20"
            aria-label="Toggle Navigation Menu"
          >
            <FiSidebar className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── Mobile & Tablet Drawer (Visible ONLY on Mobile/Tablet < 1024px) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-[60] bg-black/80 backdrop-blur-md lg:hidden drawer-overlay-fade"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] h-full bg-[#0E0F12] border-l border-white/10 flex flex-col drawer-slide-in shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── White Search Box at Top ── */}
            <div className="px-4 pt-5 pb-2 shrink-0 space-y-3">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-black text-sm font-medium placeholder:text-gray-400 outline-none border-0 shadow-sm"
                />
              </div>

              {/* ── Mobile & Tablet CTA Button (Join Now if logged out, Dashboard if logged in) ── */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between bg-white text-black font-black text-sm px-5 py-3 rounded-2xl shadow-xl hover:bg-gray-100 transition-all duration-300 group cursor-pointer"
                >
                  <span>Join Now</span>
                  <span className="bg-black text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between bg-neutral-900 text-white font-black text-sm px-5 py-3 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black transition-all duration-300 group cursor-pointer"
                >
                  <span>Go to Dashboard</span>
                  <span className="bg-white text-black group-hover:bg-black group-hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              )}
            </div>

            {/* ── Scrollable Menu Content ── */}
            <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-1">
              {/* Main Menu Items */}
              {MENU_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || (href === "/" && pathname === "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-white/10 text-white font-bold"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-500"}`}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-white/10 my-3" />

              {/* Collapsible Chat List */}
              <button
                onClick={() => setChatListOpen(!chatListOpen)}
                className="flex items-center gap-2.5 text-xs font-semibold text-gray-500 hover:text-gray-300 px-4 py-2 w-full text-left transition-colors cursor-pointer"
              >
                <FiChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${chatListOpen ? "" : "-rotate-90"}`}
                />
                <span className="tracking-wide">Chat list</span>
              </button>

              {chatListOpen && (
                <div className="space-y-0.5">
                  {CHAT_LIST.map(({ label, href, icon: ToolIcon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm transition-all duration-150 ${
                          isActive
                            ? "bg-white/10 text-white font-semibold"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <ToolIcon
                          className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                        />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── Bottom: Profile + Upgrade ── */}
            <div className="px-4 pb-6 space-y-3 shrink-0">
              <div className="h-px bg-white/10" />

              {/* User Profile Row */}
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-600 flex items-center justify-center text-black font-black text-sm shrink-0">
                    M
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm leading-tight truncate">
                      Moloy Paul
                    </p>
                    <p className="text-[11px] text-gray-500 leading-tight truncate">
                      moloy@fitora.dev
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-white text-black shrink-0">
                  PRO
                </span>
              </div>

              {/* Upgraded to Pro — White Button */}
              <Link
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-white text-black font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-gray-200 transition-all block shadow-sm"
              >
                <FiCheckCircle className="w-4 h-4" />
                <span>Upgraded to Pro</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
