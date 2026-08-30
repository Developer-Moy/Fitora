"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Flame,
  Dumbbell,
  Droplets,
  Activity,
  ArrowUpRight,
  LogOut,
  Edit3,
  ShieldCheck,
  Sparkles,
  Clock,
  Utensils,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  logoutUser,
  AuthUser,
} from "@/services/authService";

export default function ProfilePage() {
  const router = useRouter();
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editGoal, setEditGoal] = useState("Bulking & Muscle Gain");
  const [editBranch, setEditBranch] = useState(
    "Dhaka - Gulshan-2 Branch (Flagship)",
  );

  useEffect(() => {
    setIsMounted(true);
    const session = getAuthSession();
    if (session.user) {
      setLocalUser(session.user);
      setEditName(session.user.name || "");
      if (session.user.plan) setEditGoal(session.user.plan);
      if (session.user.assignedBranch)
        setEditBranch(session.user.assignedBranch);
    }
  }, []);

  const activeUser = authSession?.user || localUser;
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

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    const updatedUser: AuthUser = {
      ...(localUser || { email: userEmail, role: userRole }),
      name: editName.trim(),
      plan: editGoal,
      assignedBranch: editBranch,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem("fitora_user", JSON.stringify(updatedUser));
      localStorage.setItem("fitora_user_name", updatedUser.name);
    }
    setLocalUser(updatedUser);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    toast.success("Logged out successfully. See you soon, Champion!");
    setTimeout(() => {
      window.location.href = "/";
    }, 400);
  };

  if (!isMounted) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white selection:bg-white selection:text-black py-8 sm:py-12 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* ── Top Header Banner Card ── */}
        <div className="relative bg-[#0A0A0C] border border-white/10 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar & Identity Info */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Circular Avatar Badge */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-black font-black text-3xl sm:text-4xl flex items-center justify-center shrink-0 shadow-2xl border-4 border-black">
                {userInitial}
                <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-white" />
                </span>
              </div>

              {/* Text Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white font-sans">
                    {userName}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black shrink-0 shadow-md">
                    {isMasterAdmin
                      ? "MASTER ADMIN"
                      : isBranchAdmin
                        ? "BRANCH ADMIN"
                        : "PRO ATHLETE"}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400 font-medium flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-gray-300">
                    <Mail className="w-3.5 h-3.5" />
                    {userEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" />
                    {localUser?.assignedBranch || "Gulshan-2 Flagship Branch"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions (Edit Profile & Logout) */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-neutral-900 text-white border border-white/20 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-800 hover:border-white/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 4 Key Athletic Telemetry Snapshot Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Workouts Completed */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/25 transition-colors shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Logged Workouts
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Dumbbell className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight text-white font-sans">
                24
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                Completed this month
              </p>
            </div>
          </div>

          {/* Card 2: Current Fitness Goal */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/25 transition-colors shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Primary Goal
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl font-black tracking-tight text-white uppercase font-sans truncate">
                {localUser?.plan || "Hypertrophy"}
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                Target: +500 kcal surplus
              </p>
            </div>
          </div>

          {/* Card 3: Daily Hydration Target */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/25 transition-colors shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Hydration Goal
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Droplets className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight text-white font-sans">
                3.5 L
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                Daily optimal hydration
              </p>
            </div>
          </div>

          {/* Card 4: Health & BMI Status */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-2xl p-5 space-y-3 hover:border-white/25 transition-colors shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                BMI Index
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight text-white font-sans">
                22.5
              </p>
              <p className="text-[11px] text-gray-400 font-medium mt-1">
                Category: Healthy Composition
              </p>
            </div>
          </div>
        </div>

        {/* ── Quick Tools Navigation Grid ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black font-sans uppercase tracking-tight text-white">
              Athlete Quick Suite
            </h2>
            <span className="text-xs text-gray-400 font-medium">
              Instant AI & Workout Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Tool 1: Stopwatch */}
            <Link
              href="/stopwatch"
              className="group bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="bg-white/10 text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase text-white">
                  Gym Stopwatch
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Interval timer & set logger with audio cues
                </p>
              </div>
            </Link>

            {/* Tool 2: BMI Calculator */}
            <Link
              href="/calculator"
              className="group bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="bg-white/10 text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase text-white">
                  BMI Studio
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Macro targets & body composition insights
                </p>
              </div>
            </Link>

            {/* Tool 3: Meal Plans */}
            <Link
              href="/meals"
              className="group bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <Utensils className="w-5 h-5" />
                </div>
                <span className="bg-white/10 text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase text-white">
                  Meal Plans
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Curated chef recipes & calorie breakdowns
                </p>
              </div>
            </Link>

            {/* Tool 4: Exercise Library */}
            <Link
              href="/exercises"
              className="group bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <span className="bg-white/10 text-white w-7 h-7 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold uppercase text-white">
                  Exercise Library
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Technique videos & muscle breakdown
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── Admin Dashboard Access Banner (Visible only to Admin / Master Admin) ── */}
        {(isMasterAdmin || isBranchAdmin) && (
          <div className="bg-neutral-900/90 border border-white/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-white" />
                <h3 className="text-lg font-black uppercase text-white font-sans">
                  Enterprise Control Center
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 font-medium">
                You have elevated staff/admin credentials. Manage branches,
                athlete members, and consultation leads.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all shrink-0 cursor-pointer shadow-xl"
            >
              <span>Open Dashboard</span>
              <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center group-hover:rotate-45 group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* ── Edit Profile Modal ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-[#0E0F12] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-black uppercase tracking-tight text-white font-sans">
                  Edit Athlete Profile
                </h2>
                <p className="text-xs text-gray-400">
                  Update your display name, training goal, and preferred branch.
                </p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300">
                    Fitness Goal
                  </label>
                  <select
                    value={editGoal}
                    onChange={(e) => setEditGoal(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  >
                    <option value="Bulking & Muscle Gain">
                      Bulking & Muscle Gain
                    </option>
                    <option value="Fat Loss & Cutting">
                      Fat Loss & Cutting
                    </option>
                    <option value="Maintenance & Recomposition">
                      Maintenance & Recomposition
                    </option>
                    <option value="Athletic Strength & Power">
                      Athletic Strength & Power
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300">
                    Primary Branch
                  </label>
                  <input
                    type="text"
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white transition-colors"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-neutral-900 text-white border border-white/20 font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 bg-white text-black border border-white font-extrabold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
