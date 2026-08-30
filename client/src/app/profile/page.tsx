"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Dumbbell,
  Clock,
  Utensils,
  Activity,
  ArrowUpRight,
  LogOut,
  Edit3,
  Camera,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  Flame,
  Droplets,
  Scale,
  Ruler,
  Award,
  Loader2,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSession } from "@/lib/auth-client";
import {
  getAuthSession,
  clearAuthSession,
  logoutUser,
  AuthUser,
} from "@/services/authService";
import { uploadToImgBB, readFileAsDataURL } from "@/services/imageUploadService";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGender, setEditGender] = useState("Male");
  const [editBranch, setEditBranch] = useState("Gulshan-2 Flagship Branch");
  const [editGoal, setEditGoal] = useState("Bulking & Muscle Gain");
  const [editWeight, setEditWeight] = useState("74");
  const [editHeight, setEditHeight] = useState("178");
  const [editActivity, setEditActivity] = useState("4-5 Days / Week");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [uploadTab, setUploadTab] = useState<"file" | "url">("file");

  useEffect(() => {
    setIsMounted(true);
    const session = getAuthSession();
    if (session.user) {
      setLocalUser(session.user);
      populateForm(session.user);
    }
  }, []);

  const populateForm = (user: AuthUser) => {
    setEditName(user.name || "");
    setEditPhone(user.phone || "+880 1700-000000");
    setEditGender(user.gender || "Male");
    setEditBranch(user.assignedBranch || "Gulshan-2 Flagship Branch");
    setEditGoal(user.fitnessGoal || user.plan || "Bulking & Muscle Gain");
    setEditWeight(user.weight || "74");
    setEditHeight(user.height || "178");
    setEditActivity(user.activityLevel || "4-5 Days / Week");
    setEditBio(user.bio || "Passionate athlete aiming for peak strength & aesthetic physique.");
    setEditAvatarUrl(user.avatarUrl || user.image || "");
  };

  const activeUser = authSession?.user || localUser;
  const userName = activeUser?.name || "Athlete Member";
  const userEmail = activeUser?.email || "athlete@fitora.com";
  const userInitial = userName.charAt(0).toUpperCase() || "A";
  const userRole = (activeUser as any)?.role || "athlete";
  const userAvatar = localUser?.avatarUrl || (activeUser as any)?.image || (activeUser as any)?.avatarUrl || "";
  const isMasterAdmin =
    userRole === "master_admin" ||
    userEmail.toLowerCase().includes("master@fitora.com");
  const isBranchAdmin =
    userRole === "branch_admin" ||
    userEmail.toLowerCase().includes("admin@fitora");

  // Handle direct file selection & upload (Local Preview + ImgBB Cloud Sync)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast local preview immediately
    try {
      setIsUploading(true);
      const localDataUrl = await readFileAsDataURL(file);
      setEditAvatarUrl(localDataUrl);

      // Upload to ImgBB
      const uploadRes = await uploadToImgBB(file);
      if (uploadRes.success && uploadRes.url) {
        const finalUrl = uploadRes.url;
        setEditAvatarUrl(finalUrl);

        // Update user state and localStorage
        const updatedUser: AuthUser = {
          ...(localUser || { email: userEmail, role: userRole }),
          avatarUrl: finalUrl,
          image: finalUrl,
        };
        saveUserToStorage(updatedUser);
        toast.success(
          uploadRes.isLocal
            ? "Profile photo updated (Local Storage)!"
            : "Profile photo uploaded to ImgBB & saved!",
        );
      } else {
        // Still save local data url if upload failed
        const updatedUser: AuthUser = {
          ...(localUser || { email: userEmail, role: userRole }),
          avatarUrl: localDataUrl,
          image: localDataUrl,
        };
        saveUserToStorage(updatedUser);
        toast.success("Profile photo updated!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to process image file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setEditAvatarUrl("");
    const updatedUser: AuthUser = {
      ...(localUser || { email: userEmail, role: userRole }),
      avatarUrl: "",
      image: "",
    };
    saveUserToStorage(updatedUser);
    toast.success("Profile photo removed.");
  };

  const saveUserToStorage = (user: AuthUser) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fitora_user", JSON.stringify(user));
      if (user.name) localStorage.setItem("fitora_user_name", user.name);
    }
    setLocalUser(user);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Please enter a valid full name");
      return;
    }

    const updatedUser: AuthUser = {
      ...(localUser || { email: userEmail, role: userRole }),
      name: editName.trim(),
      phone: editPhone.trim(),
      gender: editGender,
      assignedBranch: editBranch,
      fitnessGoal: editGoal,
      plan: editGoal,
      weight: editWeight,
      height: editHeight,
      activityLevel: editActivity,
      bio: editBio.trim(),
      avatarUrl: editAvatarUrl || localUser?.avatarUrl || "",
      image: editAvatarUrl || localUser?.image || "",
    };

    saveUserToStorage(updatedUser);
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
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Hidden File Input for Direct Avatar Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp, image/gif"
          onChange={handleImageFileChange}
          className="hidden"
        />

        {/* ── 1. Athlete Header Card ── */}
        <div className="bg-[#0E0F12] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Avatar with Upload Overlay & Info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
              {/* Profile Avatar with Camera Trigger */}
              <div className="relative group">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-900 border-2 border-white/20 overflow-hidden flex items-center justify-center text-white font-black text-4xl shadow-xl">
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userInitial}</span>
                  )}

                  {/* Loading Spinner Overlay */}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/75 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                </div>

                {/* Camera Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  title="Upload / Change Profile Photo (Local or ImgBB)"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white text-black border-2 border-black flex items-center justify-center hover:bg-neutral-200 hover:scale-110 active:scale-95 transition-all shadow-lg cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Identity & Membership Info */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-sans">
                    {userName}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black shadow-md">
                    {isMasterAdmin
                      ? "MASTER ADMIN"
                      : isBranchAdmin
                        ? "BRANCH ADMIN"
                        : "PRO ATHLETE"}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-gray-400 font-medium">
                  {localUser?.bio || "Fitora Certified Athlete Member"}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap pt-1">
                  <span className="inline-flex items-center gap-1.5 text-gray-300">
                    <Mail className="w-3.5 h-3.5" />
                    {userEmail}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-gray-400">
                    <MapPin className="w-3.5 h-3.5 text-gray-300" />
                    {localUser?.assignedBranch || "Gulshan-2 Flagship"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                type="button"
                onClick={() => {
                  populateForm(localUser || { name: userName, email: userEmail, role: userRole });
                  setIsEditing(true);
                }}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-white text-black border border-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-100 hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] transition-all cursor-pointer shadow-xl"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 bg-neutral-900 text-white border border-white/20 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-full hover:bg-neutral-800 hover:border-white/40 transition-all cursor-pointer shadow-xl"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. Information Sections (Clean Athletic Grid) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Personal & Contact Information */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Personal Details
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Full Name</span>
                <span className="text-white font-bold">{userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Email Address</span>
                <span className="text-white font-semibold">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Phone Number</span>
                <span className="text-white font-semibold">
                  {localUser?.phone || "+880 1700-000000"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Gender</span>
                <span className="text-white font-semibold">
                  {localUser?.gender || "Male"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Preferred Branch</span>
                <span className="text-white font-semibold">
                  {localUser?.assignedBranch || "Gulshan-2 Flagship Branch"}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2: Physical & Fitness Metrics */}
          <div className="bg-[#0E0F12] border border-white/10 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-gray-400" />
                <h2 className="text-base font-extrabold uppercase text-white tracking-wide">
                  Fitness & Physical Profile
                </h2>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Self-Reported
              </span>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Primary Goal</span>
                <span className="text-white font-bold uppercase">
                  {localUser?.fitnessGoal || localUser?.plan || "Bulking & Muscle Gain"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Body Weight</span>
                <span className="text-white font-semibold">
                  {localUser?.weight || "74"} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Height</span>
                <span className="text-white font-semibold">
                  {localUser?.height || "178"} cm
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Activity Level</span>
                <span className="text-white font-semibold">
                  {localUser?.activityLevel || "4-5 Days / Week"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Daily Water Target</span>
                <span className="text-white font-semibold">3.5 Liters</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Quick Workout Suite ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black uppercase text-white">
              Gym & Athlete Tools
            </h2>
            <span className="text-xs text-gray-400">Quick Access</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/stopwatch"
              className="bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase text-white">
                  Stopwatch
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Interval timer</p>
              </div>
            </Link>

            <Link
              href="/calculator"
              className="bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase text-white">
                  BMI Studio
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Macro calculator</p>
              </div>
            </Link>

            <Link
              href="/meals"
              className="bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase text-white">
                  Meal Plans
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Chef recipes</p>
              </div>
            </Link>

            <Link
              href="/exercises"
              className="bg-[#0E0F12] border border-white/10 hover:border-white/30 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:scale-[1.02] transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold uppercase text-white">
                  Exercises
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5">Video guides</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── 4. Admin Management Access (If Admin) ── */}
        {(isMasterAdmin || isBranchAdmin) && (
          <div className="bg-neutral-900/90 border border-white/20 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-white" />
                <h3 className="text-sm font-black uppercase text-white">
                  Elevated Staff Dashboard
                </h3>
              </div>
              <p className="text-xs text-gray-400">
                Authorized staff portal for branches, athlete rosters, and leads.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-black font-bold text-xs px-5 py-2.5 rounded-full hover:bg-neutral-100 transition-all shrink-0 shadow-lg"
            >
              <span>Open Dashboard</span>
              <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
            </Link>
          </div>
        )}
      </div>

      {/* ── 5. Edit Profile Modal (Includes Local & ImgBB Upload) ── */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-[#0E0F12] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-xl font-black uppercase text-white font-sans">
                    Edit Profile
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Update your photo, personal info, and fitness metrics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1"
                >
                  ✕ Close
                </button>
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-3 bg-neutral-900/90 border border-white/10 rounded-2xl p-4">
                <label className="text-xs font-bold uppercase text-gray-300 block">
                  Profile Photo (Local File or ImgBB Sync)
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-black border border-white/20 overflow-hidden flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {editAvatarUrl ? (
                      <img
                        src={editAvatarUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{userInitial}</span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-3.5 py-1.5 rounded-full hover:bg-neutral-200 transition-all cursor-pointer"
                      >
                        {isUploading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        <span>Upload File (ImgBB)</span>
                      </button>

                      {editAvatarUrl && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1 bg-neutral-800 text-red-400 hover:bg-red-500/10 font-bold text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Supports JPG, PNG, WEBP. Directly synced to ImgBB and stored locally.
                    </p>
                  </div>
                </div>

                {/* Direct Image URL input option */}
                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  <span className="text-[11px] text-gray-400 font-medium">
                    Or paste direct Image Link:
                  </span>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://i.ibb.co/.../avatar.jpg"
                    className="w-full bg-black border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-gray-500 focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="+880 17..."
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Gender
                    </label>
                    <select
                      value={editGender}
                      onChange={(e) => setEditGender(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Primary Branch
                    </label>
                    <select
                      value={editBranch}
                      onChange={(e) => setEditBranch(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    >
                      <option value="Gulshan-2 Flagship Branch">Gulshan-2 Flagship</option>
                      <option value="Banani Platinum Lounge">Banani Platinum</option>
                      <option value="Dhanmondi Athletic Center">Dhanmondi Athletic</option>
                      <option value="Uttara Sector-4 Hub">Uttara Sector-4</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-gray-300">
                      Fitness Goal
                    </label>
                    <select
                      value={editGoal}
                      onChange={(e) => setEditGoal(e.target.value)}
                      className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white"
                    >
                      <option value="Bulking & Muscle Gain">Bulking</option>
                      <option value="Fat Loss & Cutting">Fat Loss</option>
                      <option value="Strength & Conditioning">Strength</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300">
                    Athlete Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Short athlete bio or fitness aspiration..."
                    className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-white resize-none"
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
