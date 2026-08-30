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
  CheckCircle2,
  ShieldCheck,
  Flame,
  Droplets,
  Award,
  Loader2,
  Trash2,
  Copy,
  ChevronRight,
  Check,
  History,
  TrendingUp,
  Sparkles,
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

// Workout History Interface
interface WorkoutLog {
  id: string;
  title: string;
  category: string;
  date: string;
  duration: string;
  calories: number;
  exercisesCount: number;
  exercises: string[];
  badge?: string;
}

// Sample Curated Gym History
const DEFAULT_WORKOUT_HISTORY: WorkoutLog[] = [
  {
    id: "w-1",
    title: "Heavy Push Day (Chest, Shoulders & Triceps)",
    category: "Hypertrophy",
    date: "Today, 07:30 AM",
    duration: "58 mins",
    calories: 490,
    exercisesCount: 5,
    exercises: [
      "Flat Barbell Bench Press (4 sets × 8-10 reps)",
      "Incline Dumbbell Press (3 sets × 12 reps)",
      "Seated Dumbbell Shoulder Press (3 sets × 10 reps)",
      "Cable Lateral Raises (4 sets × 15 reps)",
      "Tricep Rope Pushdowns (4 sets × 12 reps)",
    ],
    badge: "PR BROKEN 🏆",
  },
  {
    id: "w-2",
    title: "Pull Day (Lat Width, Mid-Back & Biceps)",
    category: "Strength",
    date: "Yesterday, 06:15 PM",
    duration: "65 mins",
    calories: 530,
    exercisesCount: 5,
    exercises: [
      "Conventional Deadlifts (4 sets × 6 reps)",
      "Lat Pulldowns (Wide Grip) (4 sets × 10 reps)",
      "Chest-Supported T-Bar Rows (3 sets × 12 reps)",
      "Incline Dumbbell Bicep Curls (4 sets × 12 reps)",
      "Face Pulls (Rear Delts) (3 sets × 15 reps)",
    ],
    badge: "COMPLETED ✅",
  },
  {
    id: "w-3",
    title: "Quad & Hamstring Power Leg Day",
    category: "Lower Body",
    date: "28 Aug 2026, 05:45 PM",
    duration: "70 mins",
    calories: 610,
    exercisesCount: 5,
    exercises: [
      "Barbell Back Squats (5 sets × 5 reps)",
      "Romanian Deadlifts (4 sets × 10 reps)",
      "Leg Press (3 sets × 15 reps)",
      "Seated Leg Curls (4 sets × 12 reps)",
      "Standing Calf Raises (4 sets × 20 reps)",
    ],
    badge: "HIGH INTENSITY 🔥",
  },
];

// Meal Plan Suggestions tailored by Fitness Goal
const MEAL_SUGGESTIONS_BY_GOAL: Record<
  string,
  {
    targetCalories: string;
    protein: string;
    carbs: string;
    fats: string;
    hydration: string;
    advice: string;
    meals: {
      type: string;
      name: string;
      calories: number;
      protein: string;
      carbs: string;
      fats: string;
      ingredients: string[];
      description: string;
    }[];
  }
> = {
  "Bulking & Muscle Gain": {
    targetCalories: "2,950 kcal",
    protein: "185g",
    carbs: "360g",
    fats: "80g",
    hydration: "3.8 L",
    advice:
      "Maintain a 400-500 kcal surplus with nutrient-dense complex carbohydrates, lean red meat, poultry, and healthy dietary fats.",
    meals: [
      {
        type: "Breakfast (Power Start)",
        name: "Double Oatmeal with Whey & Peanut Butter Bowl",
        calories: 720,
        protein: "48g",
        carbs: "85g",
        fats: "22g",
        ingredients: [
          "100g Rolled Oats",
          "1.5 Scoops Whey Isolate",
          "2 Tbsp Natural Peanut Butter",
          "1 Sliced Banana",
          "200ml Almond Milk",
        ],
        description:
          "High glycemic carb replenish combined with slow digesting fats for prolonged morning anabolism.",
      },
      {
        type: "Lunch (Post-Workout Recovery)",
        name: "Grilled Steak Bowl with Brown Rice & Avocado",
        calories: 860,
        protein: "55g",
        carbs: "90g",
        fats: "28g",
        ingredients: [
          "200g Lean Beef Sirloin",
          "250g Cooked Brown Rice",
          "1/2 Fresh Avocado",
          "1 Cup Steamed Broccoli",
          "1 Tbsp Olive Oil Drizzle",
        ],
        description:
          "Natural creatine from sirloin paired with nutrient-rich brown rice and monounsaturated healthy fats.",
      },
      {
        type: "Dinner (Overnight Recovery)",
        name: "Baked Atlantic Salmon with Sweet Potatoes & Asparagus",
        calories: 780,
        protein: "52g",
        carbs: "75g",
        fats: "26g",
        ingredients: [
          "220g Atlantic Salmon Fillet",
          "300g Roasted Sweet Potatoes",
          "150g Grilled Asparagus",
          "Lemon Herb Seasoning",
        ],
        description:
          "Rich in Omega-3 fatty acids to reduce joint inflammation and support deep REM hormone production.",
      },
    ],
  },
  "Fat Loss & Cutting": {
    targetCalories: "1,950 kcal",
    protein: "175g",
    carbs: "140g",
    fats: "50g",
    hydration: "4.0 L",
    advice:
      "Maintain a 400-500 kcal deficit while keeping protein high at 2.2g per kg of bodyweight to preserve lean muscle tissue.",
    meals: [
      {
        type: "Breakfast (High Protein)",
        name: "Egg White Veggie Scramble with Avocado Toast",
        calories: 420,
        protein: "38g",
        carbs: "28g",
        fats: "14g",
        ingredients: [
          "6 Egg Whites + 1 Whole Egg",
          "1 Cup Baby Spinach & Diced Bell Peppers",
          "1 Slice Whole Grain Sourdough",
          "30g Sliced Avocado",
        ],
        description:
          "Satiating low-calorie breakfast with high volume greens and quality amino acids.",
      },
      {
        type: "Lunch (Lean Fuel)",
        name: "Herb Grilled Chicken Breast with Quinoa Salad",
        calories: 560,
        protein: "54g",
        carbs: "45g",
        fats: "12g",
        ingredients: [
          "220g Skinless Chicken Breast",
          "120g Cooked Quinoa",
          "Cucumber, Cherry Tomatoes & Red Onion",
          "Fresh Lemon & Herb Vinaigrette",
        ],
        description:
          "Ultra-lean protein delivery with complete amino profile quinoa and micronutrient dense salad.",
      },
      {
        type: "Dinner (Low-Carb Satiety)",
        name: "Seared White Fish with Cauliflower Mash & Green Beans",
        calories: 480,
        protein: "46g",
        carbs: "22g",
        fats: "16g",
        ingredients: [
          "240g White Cod or Tilapia Fillet",
          "200g Steamed & Mashed Cauliflower with Garlic",
          "150g Sautéed Green Beans in Olive Oil",
        ],
        description:
          "High volume, very low calorie dinner to eliminate late night cravings while accelerating fat oxidation.",
      },
    ],
  },
  "Strength & Conditioning": {
    targetCalories: "2,550 kcal",
    protein: "180g",
    carbs: "270g",
    fats: "70g",
    hydration: "3.5 L",
    advice:
      "Balanced performance nutrition optimizing glycogen replenishment and central nervous system recovery.",
    meals: [
      {
        type: "Breakfast (Power Fuel)",
        name: "Protein Pancakes with Greek Yogurt & Mixed Berries",
        calories: 590,
        protein: "45g",
        carbs: "72g",
        fats: "12g",
        ingredients: [
          "Oat Flour & Egg White Batter",
          "1 Scoop Whey Isolate",
          "150g Non-fat Greek Yogurt",
          "1/2 Cup Fresh Blueberries & Honey",
        ],
        description:
          "Sustained energy release ideal for intense athletic lifting and cardiovascular sessions.",
      },
      {
        type: "Lunch (Athletic Plate)",
        name: "Lean Turkey Breast Wrap with Hummus & Roasted Veggies",
        calories: 680,
        protein: "52g",
        carbs: "70g",
        fats: "18g",
        ingredients: [
          "200g Roasted Turkey Breast",
          "Large Whole Wheat Tortilla",
          "2 Tbsp Garlic Hummus",
          "Roasted Zucchini, Peppers & Spinach",
        ],
        description:
          "Balanced glycemic index meal ensuring stable insulin levels throughout training windows.",
      },
      {
        type: "Dinner (Recovery)",
        name: "Grilled Flank Steak with Basmati Rice & Grilled Corn",
        calories: 740,
        protein: "50g",
        carbs: "68g",
        fats: "22g",
        ingredients: [
          "190g Grilled Flank Steak",
          "180g Steamed Basmati Rice",
          "Grilled Sweet Corn Cob",
          "Side Garden Salad",
        ],
        description:
          "Packed with zinc, iron, and B-vitamins to accelerate muscular rebuilding and power regeneration.",
      },
    ],
  },
  Maintenance: {
    targetCalories: "2,350 kcal",
    protein: "160g",
    carbs: "240g",
    fats: "65g",
    hydration: "3.2 L",
    advice:
      "Maintain homeostatic caloric equilibrium while cycling nutrient timing around daily workout routines.",
    meals: [
      {
        type: "Breakfast",
        name: "Avocado & Poached Eggs on Toasted Rye",
        calories: 520,
        protein: "26g",
        carbs: "42g",
        fats: "24g",
        ingredients: [
          "2 Whole Poached Eggs",
          "2 Slices Toasted Rye Bread",
          "1/2 Mashed Avocado with Chili Flakes",
          "Handful of Arugula",
        ],
        description:
          "Nutritious balance of wholesome fats, complex carbohydrates, and clean proteins.",
      },
      {
        type: "Lunch",
        name: "Mediterranean Chicken Bowl with Couscous",
        calories: 680,
        protein: "48g",
        carbs: "65g",
        fats: "18g",
        ingredients: [
          "180g Marinated Chicken Thighs",
          "150g Whole Wheat Couscous",
          "Kalamata Olives, Cucumbers & Feta Cheese",
          "Tzatziki Sauce",
        ],
        description:
          "Delicious heart-healthy meal full of polyphenols and high biological value protein.",
      },
      {
        type: "Dinner",
        name: "Teriyaki Tofu or Salmon Stir-Fry with Jasmine Rice",
        calories: 620,
        protein: "42g",
        carbs: "70g",
        fats: "16g",
        ingredients: [
          "200g Fresh Salmon or Firm Organic Tofu",
          "180g Steamed Jasmine Rice",
          "Snap Peas, Carrots, & Broccoli",
          "Low-Sodium Teriyaki Glaze",
        ],
        description:
          "Light yet deeply nourishing dinner optimized for effortless metabolic digestion.",
      },
    ],
  },
};

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { data: authSession } = useSession();
  const [localUser, setLocalUser] = useState<AuthUser | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedMealIndex, setCopiedMealIndex] = useState<number | null>(null);

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
    setEditBio(
      user.bio ||
        "Passionate athlete aiming for peak strength & aesthetic physique.",
    );
    setEditAvatarUrl(user.avatarUrl || user.image || "");
  };

  const activeUser = authSession?.user || localUser;
  const userName = activeUser?.name || "Athlete Member";
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

  const currentGoalKey =
    localUser?.fitnessGoal ||
    localUser?.plan ||
    "Bulking & Muscle Gain";

  const goalData =
    MEAL_SUGGESTIONS_BY_GOAL[currentGoalKey] ||
    MEAL_SUGGESTIONS_BY_GOAL["Bulking & Muscle Gain"];

  // Handle direct file selection & upload (Local Preview + ImgBB Cloud Sync)
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const localDataUrl = await readFileAsDataURL(file);
      setEditAvatarUrl(localDataUrl);

      const uploadRes = await uploadToImgBB(file);
      if (uploadRes.success && uploadRes.url) {
        const finalUrl = uploadRes.url;
        setEditAvatarUrl(finalUrl);

        const updatedUser: AuthUser = {
          ...(localUser || {
            name: userName,
            email: userEmail,
            role: userRole,
          }),
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
        const updatedUser: AuthUser = {
          ...(localUser || {
            name: userName,
            email: userEmail,
            role: userRole,
          }),
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
      ...(localUser || { name: userName, email: userEmail, role: userRole }),
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
      ...(localUser || { name: userName, email: userEmail, role: userRole }),
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

  const handleCopyMeal = (meal: any, index: number) => {
    const textToCopy = `FITORA NUTRITION SUGGESTION (${meal.type})\nMeal: ${meal.name}\nMacros: ${meal.calories} kcal | ${meal.protein} Protein | ${meal.carbs} Carbs | ${meal.fats} Fats\nIngredients: ${meal.ingredients.join(", ")}\nPrep note: ${meal.description}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedMealIndex(index);
    toast.success(`${meal.name} recipe & macros copied to clipboard!`);
    setTimeout(() => setCopiedMealIndex(null), 2000);
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
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10">
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
                  populateForm(
                    localUser || {
                      name: userName,
                      email: userEmail,
                      role: userRole,
                    },
                  );
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

        {/* ── 2. Information Sections (Personal & Physical Profile Grid) ── */}
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
                  {localUser?.fitnessGoal ||
                    localUser?.plan ||
                    "Bulking & Muscle Gain"}
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
                <span className="text-white font-semibold">
                  {goalData.hydration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3. Gym & Workout History Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-white" />
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-sans">
                Gym & Workout History
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 font-medium hidden sm:inline">
                {DEFAULT_WORKOUT_HISTORY.length} Logged Sessions
              </span>
              <Link
                href="/stopwatch"
                className="inline-flex items-center gap-1.5 bg-white text-black font-bold text-xs px-4 py-2 rounded-full hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Start New Session</span>
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            {DEFAULT_WORKOUT_HISTORY.map((log) => (
              <div
                key={log.id}
                className="bg-[#0E0F12] border border-white/10 hover:border-white/25 rounded-3xl p-5 sm:p-6 transition-all space-y-4 shadow-xl"
              >
                {/* Workout Title & Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="text-base font-extrabold uppercase text-white">
                        {log.title}
                      </h3>
                      {log.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-white text-black">
                          {log.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{log.date}</p>
                  </div>

                  {/* Duration & Calories Pill */}
                  <div className="flex items-center gap-3 shrink-0 text-xs font-bold text-gray-300">
                    <span className="inline-flex items-center gap-1 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {log.duration}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-neutral-900 border border-white/10 px-3 py-1.5 rounded-full text-white">
                      <Flame className="w-3.5 h-3.5 text-white" />
                      {log.calories} kcal
                    </span>
                  </div>
                </div>

                {/* Exercises List */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Logged Exercises ({log.exercisesCount}):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {log.exercises.map((exercise, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-gray-300 bg-neutral-900/60 px-3 py-2 rounded-xl border border-white/5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" />
                        <span className="truncate">{exercise}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 4. Meal Suggestion According to Profile ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-5 h-5 text-white" />
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white font-sans">
                  Personalized Nutrition Plan
                </h2>
                <p className="text-xs text-gray-400">
                  Custom meal recommendations tailored for{" "}
                  <strong className="text-white uppercase font-bold">
                    {currentGoalKey}
                  </strong>
                </p>
              </div>
            </div>

            <Link
              href="/meals"
              className="inline-flex items-center gap-1 text-xs font-bold text-gray-300 hover:text-white transition-colors"
            >
              <span>Explore All Recipes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Nutrition Macro Target Banner */}
          <div className="bg-[#0E0F12] border border-white/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Daily Macro Target ({currentGoalKey})
                </span>
                <p className="text-xs sm:text-sm text-gray-300">
                  {goalData.advice}
                </p>
              </div>

              {/* Macro Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto shrink-0">
                <div className="bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Calories
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.targetCalories}
                  </span>
                </div>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Protein
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.protein}
                  </span>
                </div>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Carbs
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.carbs}
                  </span>
                </div>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl px-4 py-2.5 text-center">
                  <span className="text-[10px] font-bold text-gray-400 block uppercase">
                    Fats
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {goalData.fats}
                  </span>
                </div>
              </div>
            </div>

            {/* Curated Daily Meal Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              {goalData.meals.map((meal, index) => (
                <div
                  key={index}
                  className="bg-neutral-900/90 border border-white/10 hover:border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {meal.type}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-white text-black">
                        {meal.calories} kcal
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-snug">
                        {meal.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {meal.description}
                      </p>
                    </div>

                    {/* Macro Split Badge */}
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-300">
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        P: {meal.protein}
                      </span>
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        C: {meal.carbs}
                      </span>
                      <span className="bg-black/60 px-2 py-1 rounded-lg border border-white/5">
                        F: {meal.fats}
                      </span>
                    </div>

                    {/* Ingredients List */}
                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Ingredients:
                      </span>
                      <ul className="text-xs text-gray-400 space-y-0.5 list-disc list-inside">
                        {meal.ingredients.map((ing, i) => (
                          <li key={i} className="truncate">
                            {ing}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Copy Recipe Button */}
                  <button
                    type="button"
                    onClick={() => handleCopyMeal(meal, index)}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-2 rounded-xl border border-white/10 transition-colors cursor-pointer"
                  >
                    {copiedMealIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                        <span>Copy Recipe & Macros</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 5. Admin Management Access (If Admin) ── */}
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
                Authorized staff portal for branches, athlete rosters, and
                leads.
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

      {/* ── 6. Edit Profile Modal (Includes Local & ImgBB Upload) ── */}
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
                      Supports JPG, PNG, WEBP. Directly synced to ImgBB and
                      stored locally.
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
                      <option value="Gulshan-2 Flagship Branch">
                        Gulshan-2 Flagship
                      </option>
                      <option value="Banani Platinum Lounge">
                        Banani Platinum
                      </option>
                      <option value="Dhanmondi Athletic Center">
                        Dhanmondi Athletic
                      </option>
                      <option value="Uttara Sector-4 Hub">
                        Uttara Sector-4
                      </option>
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
                      <option value="Bulking & Muscle Gain">
                        Bulking & Muscle Gain
                      </option>
                      <option value="Fat Loss & Cutting">
                        Fat Loss & Cutting
                      </option>
                      <option value="Strength & Conditioning">
                        Strength & Conditioning
                      </option>
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
