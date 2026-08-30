"use client";

import { useState, useEffect } from "react";
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
  ChevronDown as FiChevronDown,
  Sparkles,
  User as FiUser,
  LogOut as FiLogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  AuthUser,
} from "@/services/authService";

/* ── Desktop Horizontal Navigation Links ── */
const NAV_LINKS = [
  { label: "BMI Calculator", href: "/calculator" },
  { label: "Gym Stopwatch", href: "/stopwatch" },
  { label: "Meal Plans", href: "/meals" },
  { label: "Exercise Library", href: "/exercises" },
];

/* ── Mobile & Tablet Drawer Main Menu Items ── */
const MENU_ITEMS = [
  { label: "Exercise Library", href: "/exercises", icon: FiDumbbell },
  { label: "Meal Plans", href: "/meals", icon: FiUtensils },
  { label: "BMI Calculator", href: "/calculator", icon: FiActivity },
  { label: "Gym Stopwatch", href: "/stopwatch", icon: FiClock },
  { label: "My Profile", href: "/profile", icon: FiUser },
  { label: "Dashboard", href: "/dashboard", icon: FiSettings },
];

/* ── Mobile Collapsible Quick Tools / AI Suite ── */
const QUICK_TOOLS = [
  { label: "Fitora AI Assistant", href: "/dashboard", icon: Sparkles },
  { label: "Workout Stopwatch", href: "/stopwatch", icon: FiClock },
  { label: "BMI Studio Calculator", href: "/calculator", icon: FiActivity },
  { label: "Nutrition & Meals", href: "/meals", icon: FiUtensils },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatListOpen, setChatListOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const session = getAuthSession();
    if (session.user) {
      setLocalUser(session.user);
    }
  }, []);

  const activeUser = authSession?.user || localUser;
  const isLoggedIn = !!activeUser;

  const userName = activeUser?.name || "Athlete Member";
  const userEmail = activeUser?.email || "athlete@fitora.com";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userRole = (activeUser as any)?.role || "athlete";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");
  const isAdmin = isMasterAdmin || isBranchAdmin;

  const handleLogout = () => {
    clearAuthSession();
    if (typeof window !== "undefined") {
      localStorage.removeItem("fitora_auth_session");
      localStorage.removeItem("fitora_active_role");
    }
    toast.success("Logged out successfully.");
    setLocalUser(null);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.location.reload();
    }, 400);
  };

  if (
    pathname?.startsWith("/dashboard") ||
    pathname === "/login" ||
    pathname === "/register"
  ) {
    return null;
  }

  // Search filter for menu items
  const filteredMenuItems = searchQuery.trim()
    ? MENU_ITEMS.filter((item) =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : MENU_ITEMS;

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
          {/* PC Desktop Profile & CTA Section */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="hidden lg:inline-flex group items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
            >
              <span>Join Now</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          ) : (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="group flex items-center gap-2.5 bg-neutral-900 border border-white/20 hover:border-white/50 text-white font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-lg"
              >
                <div className="w-7 h-7 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                  {userInitial}
                </div>
                <span className="max-w-[120px] truncate font-extrabold text-xs">
                  {userName}
                </span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown Popup Card */}
              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2.5 w-64 bg-[#0E0F12] border border-white/15 rounded-2xl p-3 shadow-2xl space-y-2 z-50 backdrop-blur-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 bg-neutral-900/90 rounded-xl border border-white/10 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs leading-tight truncate">
                        {userName}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-0.5 pt-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <FiUser className="w-4 h-4 text-gray-400" />
                      <span>My Athlete Profile</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <FiSettings className="w-4 h-4 text-gray-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-left"
                    >
                      <FiLogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile & Tablet Toggle (< 1024px) — White Background & Black Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden cursor-pointer shrink-0 p-2 rounded-xl bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <FiClose className="w-5 h-5 text-black stroke-[2.5]" />
            ) : (
              <FiSidebar className="w-5 h-5 text-black stroke-[2.5]" />
            )}
          </button>
        </div>
      </nav>

      {/* ── Mobile & Tablet Drawer (Visible ONLY on Mobile/Tablet < 1024px) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-[90] bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[360px] h-full bg-[#0E0F12] border-l border-white/10 flex flex-col shadow-2xl z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── 1. White Search Box at Top ── */}
            <div className="px-4 pt-4 pb-2 shrink-0">
              <div className="relative">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modules & pages..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white text-black text-xs font-semibold placeholder:text-gray-400 outline-none border-0 shadow-md"
                />
              </div>
            </div>

            {/* ── 2. Scrollable Menu Content ── */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
              {/* Main Menu Items */}
              {filteredMenuItems.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || (href === "/" && pathname === "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs sm:text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-white/15 text-white font-bold border border-white/20"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-gray-400"}`}
                    />
                    <span>{label}</span>
                  </Link>
                );
              })}

              {/* Divider */}
              <div className="h-px bg-white/10 my-2.5" />

              {/* Collapsible Quick Tools / AI Suite */}
              <button
                onClick={() => setChatListOpen(!chatListOpen)}
                className="flex items-center justify-between text-xs font-bold text-gray-400 hover:text-white px-3 py-2 w-full text-left transition-colors cursor-pointer rounded-xl hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  <FiChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      chatListOpen ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="tracking-wide uppercase text-[10px] font-extrabold text-gray-400">
                    Quick AI & Tools
                  </span>
                </div>
                <span className="text-[9px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-bold">
                  {QUICK_TOOLS.length}
                </span>
              </button>

              {chatListOpen && (
                <div className="space-y-1 pl-1">
                  {QUICK_TOOLS.map(({ label, href, icon: ToolIcon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all duration-150 ${
                          isActive
                            ? "bg-white/15 text-white font-semibold"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <ToolIcon
                          className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-gray-400"}`}
                        />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── 3. Bottom: User Profile Card (Logged-in Only) + Action Buttons ── */}
            <div className="px-4 pb-5 pt-3 space-y-3 shrink-0 bg-[#0E0F12] border-t border-white/10">
              {/* User Profile Row (Only shown when logged in) */}
              {isLoggedIn && (
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 bg-neutral-900/90 hover:bg-neutral-800 rounded-2xl border border-white/10 hover:border-white/25 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white text-black font-black text-xs flex items-center justify-center shrink-0 shadow-md">
                      {userInitial}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-bold text-xs leading-tight truncate">
                        {userName}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight truncate">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-white text-black shrink-0 shadow-sm">
                    {isMasterAdmin ? "MASTER" : isBranchAdmin ? "ADMIN" : "PRO"}
                  </span>
                </Link>
              )}

              {/* Action Buttons */}
              {!isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-between bg-white text-black border border-white font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-xl hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all group cursor-pointer"
                >
                  <span>Join Now</span>
                  <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black border border-white font-extrabold text-xs px-4 py-2.5 rounded-full shadow-xl hover:bg-neutral-100 transition-all active:scale-95 cursor-pointer"
                  >
                    <FiUser className="w-3.5 h-3.5" />
                    <span>Profile</span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-900 text-red-400 border border-white/15 hover:border-red-500/40 hover:bg-red-500/10 font-bold text-xs px-4 py-2.5 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer"
                  >
                    <FiLogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
