"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dropdown,
  DropdownTrigger,
  DropdownPopover,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  FiChevronDown,
  FiUser,
  FiBell,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Calculator", href: "/calculator" },
  { label: "Stopwatch", href: "/stopwatch" },
  { label: "Plans", href: "/plans" },
  { label: "Community", href: "/community" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Hide top navbar inside /dashboard routes matching design reference
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3.5 bg-black/80 backdrop-blur-md border-b border-white/5">
      {/* ── Logo ── */}
      <Link href="/" className="flex items-center gap-2 select-none group">
        <img
          src="/logo.svg"
          alt="Fitora logo"
          className="w-6 h-6 object-contain group-hover:scale-105 transition-transform duration-200"
        />
        <span className="text-white font-bold text-lg tracking-wide">
          Fitora
        </span>
      </Link>

      {/* ── Nav Links ── */}
      <ul className="hidden md:flex items-center gap-8">
        {NAV_LINKS.map(({ label, href }) => {
          const isActive = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={`relative py-1 text-sm font-medium transition-colors duration-200 block ${
                  isActive
                    ? "text-red-500 font-semibold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-red-600 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* ── Right Actions & Account Dropdown ── */}
      <div className="flex items-center gap-2.5">
        {/* Live AI Engine Status Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>AI Online</span>
        </div>

        {/* Login & Register Action Buttons */}
        <Link
          href="/login"
          className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/90 hover:text-white transition-all cursor-pointer"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="hidden sm:inline-flex px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md shadow-red-950/50 transition-all cursor-pointer"
        >
          Register
        </Link>

        <Dropdown>
          <DropdownTrigger className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/20 hover:bg-emerald-900/30 transition-all duration-200 outline-none cursor-pointer">
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black animate-pulse" />

            <span className="text-sm font-medium text-white/90">Account</span>

            {/* Avatar image */}
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <FiChevronDown className="text-white/60 text-xs" />
          </DropdownTrigger>

          <DropdownPopover
            placement="bottom end"
            className="p-1 rounded-xl bg-[#111] border border-white/10 shadow-2xl min-w-50"
          >
            <DropdownMenu aria-label="Account Actions">
              <DropdownItem className="px-3 py-2 border-b border-white/10 pointer-events-none">
                <p className="font-semibold text-white text-sm">Moloy Paul</p>
                <p className="text-xs text-white/40">moloy@fitora.dev</p>
              </DropdownItem>

              <DropdownItem className="px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg cursor-pointer">
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 w-full"
                >
                  <FiUser className="text-white/40" />
                  <span>Profile</span>
                </Link>
              </DropdownItem>

              <DropdownItem className="px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FiBell className="text-white/40" />
                  <span>Notifications</span>
                </div>
              </DropdownItem>

              <DropdownItem className="px-3 py-2 text-sm text-white/80 hover:text-white rounded-lg cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <FiSettings className="text-white/40" />
                  <span>Settings</span>
                </div>
              </DropdownItem>

              <DropdownItem className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer border-t border-white/10 mt-1">
                <div className="flex items-center gap-2.5">
                  <FiLogOut />
                  <span>Log Out</span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </DropdownPopover>
        </Dropdown>
      </div>
    </nav>
  );
}
