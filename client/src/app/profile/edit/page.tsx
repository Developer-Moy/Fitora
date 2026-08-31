"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  getAuthSession,
  saveAuthSession,
} from "@/services/authService";
import {
  uploadToImgBB,
  readFileAsDataURL,
} from "@/services/imageUploadService";
import { ArrowLeft, Upload, Loader2, Trash2 } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { useSession } from "@/lib/auth-client";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: betterAuthSession, isPending } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [activeToken, setActiveToken] = useState<string>("");

  // Form states
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editWeight, setEditWeight] = useState("");
  const [editHeight, setEditHeight] = useState("");
  const [editGender, setEditGender] = useState("Male");
  const [editBranch, setEditBranch] = useState("Gulshan-2 Flagship Branch");
  const [editGoal, setEditGoal] = useState("Bulking & Muscle Gain");
  const [editBio, setEditBio] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isPending) return; // Wait for BetterAuth

    const localSession = getAuthSession();
    const betterAuthUser = betterAuthSession?.user;

    // Prioritize local session, fallback to BetterAuth session
    const resolvedUser =
      localSession.user || (betterAuthUser as any as AuthUser);

    if (!resolvedUser) {
      router.push("/login");
      return;
    }

    setLocalUser(resolvedUser);
    setActiveToken(localSession.token || "");

    setEditName(resolvedUser.name || "");
    setEditPhone(resolvedUser.phone || "");
    setEditWeight(resolvedUser.weight?.toString() || "");
    setEditHeight(resolvedUser.height?.toString() || "");
    setEditGender(resolvedUser.gender || "Male");
    setEditBranch(
      resolvedUser.assignedBranch || "Gulshan-2 Flagship Branch",
    );
    setEditGoal(resolvedUser.fitnessGoal || "Bulking & Muscle Gain");
    setEditBio(resolvedUser.bio || "");
    setEditAvatarUrl(resolvedUser.avatarUrl || resolvedUser.image || "");
  }, [router, betterAuthSession, isPending]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await readFileAsDataURL(file);
      setEditAvatarUrl(dataUrl); // optimistic

      const result = await uploadToImgBB(file);
      if (result.success && result.url) {
        setEditAvatarUrl(result.url);
        toast.success("Photo synced to ImgBB!");
      } else if (result.error) {
         toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setEditAvatarUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localUser) return;

    const updatedUser: AuthUser = {
      ...localUser,
      name: editName,
      phone: editPhone,
      weight: editWeight || undefined,
      height: editHeight || undefined,
      gender: editGender,
      assignedBranch: editBranch,
      fitnessGoal: editGoal,
      bio: editBio,
      avatarUrl: editAvatarUrl,
    };

    saveAuthSession(activeToken, updatedUser);
    toast.success("Profile saved successfully!");

    // Slight delay before redirect so user sees the toast
    setTimeout(() => {
      router.push("/profile");
    }, 800);
  };

  if (!localUser) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#fff",
            color: "#000",
            fontWeight: "bold",
            borderRadius: "99px",
            fontSize: "12px",
          },
        }}
      />

      <div className="w-full max-w-lg bg-black border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-5">
          <button
            onClick={() => router.push("/profile")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Edit Profile
            </h1>
            <p className="text-[11px] text-white/50 font-medium">
              Update your Fitora athlete details.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Photo Section */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-900 border border-white/20 overflow-hidden flex items-center justify-center text-white text-2xl font-black shrink-0">
              {editAvatarUrl ? (
                <img
                  src={editAvatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{localUser.name?.[0]?.toUpperCase() || "?"}</span>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                className="hidden"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-[10px] sm:text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-colors"
                >
                  {isUploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  Upload Photo
                </button>
                {editAvatarUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-400 font-bold text-[10px] sm:text-xs px-4 py-2 rounded-full hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                  Gender
                </label>
                <select
                  value={editGender}
                  onChange={(e) => setEditGender(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                  Branch
                </label>
                <select
                  value={editBranch}
                  onChange={(e) => setEditBranch(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                >
                  <option value="Gulshan-2 Flagship Branch">
                    Gulshan-2 Flagship
                  </option>
                  <option value="Banani Platinum Lounge">
                    Banani Platinum
                  </option>
                  <option value="Dhanmondi Athletic Center">
                    Dhanmondi Athletic
                  </option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={editHeight}
                  onChange={(e) => setEditHeight(e.target.value)}
                  className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                Fitness Goal
              </label>
              <select
                value={editGoal}
                onChange={(e) => setEditGoal(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              >
                <option value="Bulking & Muscle Gain">
                  Bulking & Muscle Gain
                </option>
                <option value="Fat Loss & Cutting">Fat Loss & Cutting</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-white/70 tracking-wider">
                Athlete Bio
              </label>
              <input
                type="text"
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full bg-transparent border border-white/20 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black font-black text-sm uppercase tracking-wider py-4 rounded-xl hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}
