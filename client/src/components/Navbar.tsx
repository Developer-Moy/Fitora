"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Search as FiSearch,
  CreditCard as FiCreditCard,
  CheckCircle2 as FiCheckCircle,
  Activity as FiActivity,
  Clock as FiClock,
} from "lucide-react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";

import { useSession } from "@/lib/auth-client";

/* ── Main Menu Items (Mobile & Tablet Drawer) ── */
const MENU_ITEMS = [
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
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl transition-all duration-300 lg:hidden cursor-pointer shrink-0 flex items-center justify-center active:scale-90 border bg-gradient-to-b from-white via-neutral-100 to-gray-200 text-black border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:brightness-105 ${
              mobileMenuOpen ? "rotate-90" : ""
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <FaXmark className="w-5 h-5 text-black" />
            ) : (
              <FaBarsStaggered className="w-5 h-5 text-black" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile & Tablet Drawer (Visible ONLY on Mobile/Tablet < 1024px) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-[90] bg-black/80 backdrop-blur-md lg:hidden drawer-overlay-fade"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[88vw] max-w-[370px] h-full bg-[#08090C]/95 backdrop-blur-3xl border-l border-white/15 flex flex-col drawer-slide-in shadow-[0_0_80px_rgba(0,0,0,0.98)] z-[100] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/[0.04] rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

            {/* ── Top Header Tag & Search ── */}
            <div className="px-5 pt-5 pb-2 shrink-0 space-y-3 relative z-10">
              <div className="flex items-center justify-between pb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                  <span className="text-[10px] font-black tracking-[0.25em] text-gray-300 uppercase font-sans">
                    FITORA PORTAL
                  </span>
                </div>
                <span className="text-[9px] font-extrabold text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gym & AI
                </span>
              </div>

              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-900/90 text-white text-sm font-medium placeholder:text-gray-500 outline-none border border-white/15 focus:border-white focus:bg-neutral-800 transition-all shadow-inner"
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
            <div className="flex-1 overflow-y-auto px-5 pt-2 pb-4 space-y-2 relative z-10">
              {/* Main Menu Items */}
              {MENU_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || (href === "/" && pathname === "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-300 group border ${
                      isActive
                        ? "bg-white text-black font-black border-white shadow-[0_4px_25px_rgba(255,255,255,0.2)]"
                        : "bg-neutral-900/60 text-gray-300 hover:text-white hover:bg-neutral-800/80 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                          isActive
                            ? "bg-black text-white"
                            : "bg-white/5 text-gray-400 group-hover:text-white group-hover:bg-white/10"
                        }`}
                      >
                        <Icon className="w-4 h-4 stroke-[2]" />
                      </div>
                      <span className="tracking-wide font-bold">{label}</span>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 transition-transform duration-300 group-hover:rotate-45 ${
                        isActive
                          ? "text-black"
                          : "text-gray-500 group-hover:text-white"
                      }`}
                    />
                  </Link>
                );
              })}
            </div>

            {/* ── Bottom: Profile + Upgrade ── */}
            <div className="px-5 pb-6 space-y-3 shrink-0 relative z-10">
              <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* User Profile Card */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-900/90 border border-white/15 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white to-gray-400 flex items-center justify-center text-black font-black text-sm shrink-0 shadow-md">
                    M
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-bold text-sm leading-tight truncate">
                      Moloy Paul
                    </p>
                    <p className="text-[11px] text-gray-400 leading-tight truncate">
                      moloy@fitora.dev
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-white text-black shrink-0 tracking-wider shadow-sm">
                  PRO
                </span>
              </div>

              {/* Upgraded to Pro — Button */}
              <Link
                href="/#pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 rounded-2xl bg-white text-black font-black text-sm text-center flex items-center justify-center gap-2 hover:bg-gray-200 transition-all block shadow-xl cursor-pointer"
              >
                <FiCheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Upgraded to Pro</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
