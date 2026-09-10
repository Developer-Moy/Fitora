"use client";

import { useState, useEffect, useRef } from "react";
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
  Home as FiHome,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  logoutUser,
  AuthUser,
  AUTH_SESSION_UPDATED,
  getCurrentUserApi,
} from "@/services/authService";
import NotificationBell from "@/components/notifications/NotificationBell";

/* ── Navigation Links (Exact Match Between PC & Mobile Hamburger) ── */
const NAV_LINKS = [
  { label: "Home", href: "/", icon: FiHome },
  { label: "BMI Calculator", href: "/calculator", icon: FiActivity },
  { label: "Gym Stopwatch", href: "/stopwatch", icon: FiClock },
  { label: "Meal Plans", href: "/meals", icon: FiUtensils },
  { label: "Exercise Library", href: "/exercises", icon: FiDumbbell },
];

/* ── Symmetrical Vector Barbell Indicator Half ── */
const DumbbellHalf = ({ side }: { side: "left" | "right" }) => (
  <svg
    viewBox="0 0 20 16"
    className={`w-4 h-3.5 shrink-0 pointer-events-none text-white ${
      side === "right" ? "-scale-x-100" : ""
    }`}
    fill="currentColor"
    aria-hidden="true"
  >
    {/* Outer Plate */}
    <rect x="1" y="1" width="3" height="14" rx="1" />
    {/* Inner Plate */}
    <rect x="6" y="3" width="3" height="10" rx="1" />
    {/* Shaft / Bar */}
    <rect x="9" y="6.75" width="10" height="2.5" rx="1.25" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);

  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);

    const syncUser = () => {
      const session = getAuthSession();
      if (session.user) {
        setLocalUser(session.user);
      }
      const currentUser = session.user || authSession?.user;
      const role =
        (currentUser as any)?.role ||
        (typeof window !== "undefined"
          ? localStorage.getItem("fitora_active_role") ||
            localStorage.getItem("fitora_user_role")
          : "");
      const plan =
        (currentUser as any)?.plan ||
        (typeof window !== "undefined"
          ? localStorage.getItem("fitora_user_plan")
          : "");

      const hasProStatus =
        role === "premium_user" ||
        role === "master_admin" ||
        Boolean(
          plan &&
          plan.toLowerCase() !== "free" &&
          plan.toLowerCase() !== "free_user" &&
          plan.trim() !== "",
        );

      setIsPremium(Boolean(hasProStatus));

      // Anti-tamper verification: Reconcile with authoritative server database claims
      const token = session.token;
      const targetUserId =
        (currentUser as any)?.id ||
        (currentUser as any)?._id ||
        session?.user?.id;
      const targetEmail = currentUser?.email || session?.user?.email;

      if (token || targetUserId || targetEmail) {
        getCurrentUserApi({ userId: targetUserId, email: targetEmail })
          .then((res) => {
            if (res.success && res.user) {
              const serverRole = res.user.role;
              const serverPlan = res.user.plan;
              const isServerPro =
                serverRole === "premium_user" ||
                serverRole === "master_admin" ||
                Boolean(
                  serverPlan &&
                  serverPlan.toLowerCase() !== "free" &&
                  serverPlan.toLowerCase() !== "free_user" &&
                  serverPlan.trim() !== "",
                );

              setIsPremium(Boolean(isServerPro));

              // If someone injected fake role/plan via browser console, wipe it immediately
              if (
                !isServerPro &&
                typeof window !== "undefined" &&
                (localStorage.getItem("fitora_user_role") === "premium_user" ||
                  localStorage.getItem("fitora_active_role") === "premium_user")
              ) {
                localStorage.setItem("fitora_user_role", serverRole || "user");
                localStorage.setItem(
                  "fitora_active_role",
                  serverRole || "user",
                );
                localStorage.removeItem("fitora_user_plan");
              }
            }
          })
          .catch(() => {});
      } else {
        setIsPremium(false);
      }
    };

    syncUser();

    window.addEventListener(AUTH_SESSION_UPDATED, syncUser);
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener(AUTH_SESSION_UPDATED, syncUser);
      window.removeEventListener("storage", syncUser);
    };
  }, [authSession]);

  const activeUser = authSession?.user || localUser;
  const isLoggedIn = isMounted && !!activeUser;

  const userName = activeUser?.name || "Athlete Member";
  const userFirstName = userName.split(" ")[0];
  const userEmail = activeUser?.email || "athlete@fitora.com";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userRole = (activeUser as any)?.role || "athlete";
  const userAvatar =
    localUser?.avatarUrl ||
    (activeUser as any)?.image ||
    (activeUser as any)?.avatarUrl ||
    "";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");
  const isAdmin = isMasterAdmin || isBranchAdmin;

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    toast.success("Logged out successfully.");
    setLocalUser(null);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

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
      <nav className="fixed top-0 left-0 right-0 z-[70] bg-black/95 backdrop-blur-md text-white border-b border-white/10 h-16 sm:h-20 select-none">
        <div className="w-11/12 max-w-7xl mx-auto h-full flex items-center justify-between relative">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            onClick={() => {
              if (pathname === "/")
                window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group select-none shrink-0"
          >
            <img
              src="/logo.svg"
              alt="Fitora logo"
              className="w-8 h-8 object-contain filter brightness-0 invert group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-white font-black text-lg sm:text-xl tracking-wider uppercase leading-none font-sans">
                  FITORA
                </span>
                {isMounted && isPremium && (
                  <Link
                    href="#pricing"
                    className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider border border-white hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer leading-none"
                  >
                    PRO
                  </Link>
                )}
              </div>
              <span className="text-[9px] text-white/60 font-bold tracking-[0.25em] uppercase">
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
                <li key={label} className="relative flex items-center">
                  <Link
                    href={href}
                    className="group relative flex items-center justify-center gap-1.5 sm:gap-2 py-2 transition-all duration-200 whitespace-nowrap"
                  >
                    {/* Left Weight Plates & Shaft (Exact mathematical vector, smooth slide-down from top) */}
                    {isActive && (
                      <div
                        className="flex items-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        aria-hidden="true"
                      >
                        <DumbbellHalf side="left" />
                      </div>
                    )}

                    <span
                      className={`text-xs xl:text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? "text-white font-extrabold tracking-tight"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      {label}
                    </span>

                    {/* Right Shaft & Weight Plates (Exact mirror vector, smooth slide-down from top) */}
                    {isActive && (
                      <div
                        className="flex items-center pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        aria-hidden="true"
                      >
                        <DumbbellHalf side="right" />
                      </div>
                    )}
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
              <div className="hidden lg:flex items-center gap-3">
                {/* If user is not yet PRO, show a PRO upgrade button matching other buttons */}
                {isMounted && !isPremium && (
                  <Link
                    href="#pricing"
                    className="group inline-flex items-center justify-center bg-white text-black border border-white font-extrabold text-xs sm:text-sm px-4 py-2 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <span>PRO</span>
                  </Link>
                )}

                <NotificationBell />

                <div
                  ref={profileDropdownRef}
                  className="relative min-w-[145px] sm:min-w-[155px]"
                >
                  {/* Profile Dropdown Button with Profile Image */}
                  <button
                    type="button"
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-full h-10 group inline-flex items-center justify-between gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm pl-1.5 pr-3.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-xl cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-black/10">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{userInitial}</span>
                        )}
                      </div>
                      <span className="whitespace-nowrap font-extrabold text-xs sm:text-sm text-black truncate">
                        {userFirstName}
                      </span>
                    </div>
                    <FiChevronDown
                      className={`w-3.5 h-3.5 text-black stroke-[2.5] shrink-0 transition-transform duration-300 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Profile Dropdown (Transparent container: 2 white buttons with smooth cascading slide animation) */}
                  <div
                    className={`absolute right-0 left-0 mt-2 w-full flex flex-col gap-2 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      profileDropdownOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto visible"
                        : "opacity-0 -translate-y-3 pointer-events-none invisible"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link
                      href="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className={`w-full h-10 group inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-extrabold text-xs sm:text-sm px-4 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] shadow-2xl cursor-pointer whitespace-nowrap transform transition-all duration-300 ease-out ${
                        profileDropdownOpen
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-2 opacity-0"
                      }`}
                    >
                      <FiUser className="w-4 h-4 text-black stroke-[2.5]" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className={`w-full h-10 group inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-extrabold text-xs sm:text-sm px-4 rounded-full hover:bg-neutral-100 hover:text-red-600 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98] shadow-2xl cursor-pointer whitespace-nowrap text-left transform transition-all duration-300 delay-75 ease-out ${
                        profileDropdownOpen
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-4 opacity-0"
                      }`}
                    >
                      <FiLogOut className="w-4 h-4 text-black stroke-[2.5] group-hover:text-red-600 transition-colors" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile & Tablet Actions (< 1024px) */}
            <div className="flex items-center gap-2.5 lg:hidden">
              {isMounted && userEmail && <NotificationBell />}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="cursor-pointer shrink-0 p-2 rounded-xl bg-white text-black border border-white hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all duration-200 active:scale-95 shadow-md flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <FiClose className="w-5 h-5 text-black stroke-[2.5]" />
                ) : (
                  <FiSidebar className="w-5 h-5 text-black stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile & Tablet Drawer (Visible ONLY on Mobile/Tablet < 1024px) ── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 sm:top-20 z-[90] bg-black/80 backdrop-blur-md lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-[85vw] max-w-[320px] h-full bg-black border-l border-white/10 flex flex-col justify-between shadow-2xl z-[100]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Main Navigation Links (Exact Match to PC Navbar) ── */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40 px-3 pb-1">
                Navigation
              </p>
              {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  pathname === href || (href === "/" && pathname === "/");
                return (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs sm:text-sm transition-all duration-150 ${
                      isActive
                        ? "bg-white text-black font-extrabold shadow-lg"
                        : "text-white/70 hover:text-white hover:bg-white/10 font-semibold"
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon
                        className={`w-[18px] h-[18px] shrink-0 ${isActive ? "text-black" : "text-white/60"}`}
                      />
                      <span className="truncate">{label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Bottom Actions (Exact Match to PC Navbar Actions) ── */}
            <div className="px-4 pb-6 pt-4 space-y-3 shrink-0 bg-black border-t border-white/10">
              {isMounted && !isPremium && (
                <Link
                  href="#pricing"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black border border-white font-extrabold text-xs py-2.5 rounded-full shadow-lg hover:bg-neutral-100 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Upgrade to PRO</span>
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
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-neutral-950 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-black text-white font-black text-xs flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-white/20">
                        {userAvatar ? (
                          <img
                            src={userAvatar}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{userInitial}</span>
                        )}
                      </div>
                      <p className="text-white font-extrabold text-xs uppercase tracking-wider truncate">
                        {userName}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold bg-white text-black shrink-0">
                      {isMasterAdmin
                        ? "MASTER"
                        : isBranchAdmin
                          ? "ADMIN"
                          : isPremium
                            ? "PRO"
                            : "MEMBER"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white text-black border border-white font-extrabold text-xs px-3.5 py-2.5 rounded-full shadow-xl hover:bg-neutral-100 transition-all active:scale-95 cursor-pointer"
                    >
                      <FiUser className="w-3.5 h-3.5" />
                      <span>My Profile</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-black text-red-400 border border-white/15 hover:border-red-500/40 hover:bg-red-500/10 font-bold text-xs px-3.5 py-2.5 rounded-full shadow-xl transition-all active:scale-95 cursor-pointer"
                    >
                      <FiLogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
