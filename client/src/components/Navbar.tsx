"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Search as FiSearch,
  Settings as FiSettings,
  Menu as FiSidebar,
  X as FiClose,
  Activity as FiActivity,
  Clock as FiClock,
  Utensils as FiUtensils,
  Dumbbell as FiDumbbell,
  Home as FiHome,
} from "lucide-react";

import { useSession } from "@/lib/auth-client";

/* ── Desktop Horizontal Navigation Links ── */
const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "BMI Calculator", href: "/calculator" },
  { label: "Gym Stopwatch", href: "/stopwatch" },
  { label: "Meal Plans", href: "/meals" },
  { label: "Exercise Library", href: "/exercises" },
];

/* ── Mobile & Tablet Drawer Links ── */
const MOBILE_LINKS = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "BMI Calculator", href: "/calculator", icon: FiActivity },
  { label: "Gym Stopwatch", href: "/stopwatch", icon: FiClock },
  { label: "Meal Plans", href: "/meals", icon: FiUtensils },
  { label: "Exercise Library", href: "/exercises", icon: FiDumbbell },
  { label: "Dashboard", href: "/dashboard", icon: FiSettings },
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
      <nav className="fixed top-0 left-0 right-0 z-[70] bg-black/95 backdrop-blur-md text-white border-b border-white/10 h-16 sm:h-20 flex items-center justify-between px-4 sm:px-8 lg:px-16 select-none">
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

        {/* ── PC / Desktop Navigation (Centered) ── */}
        <ul className="hidden lg:flex items-center gap-6 xl:gap-8 absolute left-1/2 -translate-x-1/2">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive =
              pathname === href || (href === "/" && pathname === "/");
            return (
              <li key={label}>
                <Link
                  href={href}
                  className={`text-xs xl:text-sm font-semibold transition-colors duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-white font-extrabold"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Right Side Actions ── */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* PC Desktop CTA Button */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="hidden lg:inline-flex group items-center gap-2 bg-white text-black font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-gray-200 transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Join Now</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-300">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="hidden lg:inline-flex group items-center gap-2 bg-white/10 border border-white/20 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Dashboard</span>
              <span className="bg-white text-black group-hover:bg-black group-hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          )}

          {/* Mobile & Tablet Toggle (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white hover:text-gray-300 transition-colors lg:hidden cursor-pointer shrink-0 p-2 rounded-xl bg-white/10 border border-white/20"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <FiClose className="w-5 h-5" />
            ) : (
              <FiSidebar className="w-5 h-5" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile & Tablet Drawer ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-[90] bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[340px] h-full bg-[#0E0F12] border-l border-white/10 flex flex-col shadow-2xl z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-3">
              {/* CTA in Drawer */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between bg-white text-black font-extrabold text-sm px-5 py-3 rounded-2xl shadow-xl hover:bg-gray-200 transition-all group cursor-pointer"
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
                  className="w-full flex items-center justify-between bg-white/10 text-white font-extrabold text-sm px-5 py-3 rounded-2xl border border-white/20 shadow-xl hover:bg-white hover:text-black transition-all group cursor-pointer"
                >
                  <span>Open Dashboard</span>
                  <span className="bg-white text-black group-hover:bg-black group-hover:text-white w-7 h-7 rounded-full flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  </span>
                </Link>
              )}
            </div>

            {/* Menu List */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {MOBILE_LINKS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || (href === "/" && pathname === "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-white text-black font-bold"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
