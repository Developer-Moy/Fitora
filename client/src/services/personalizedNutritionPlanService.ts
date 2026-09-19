/**
 * Personalized Nutrition Plan Client Service
 * Connects frontend UI to rule-based target generation & MongoDB persistence
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface MealTargetItem {
  mealType: "breakfast" | "lunch" | "dinner";
  title: string;
  calorieTarget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  caloriePercentage: number;
  timingAdvice: string;
  macroFocus: string;
}

export interface BiometricsSnapshot {
  bmi: number;
  bmiCategory: "underweight" | "normal" | "overweight" | "obese";
  weightKg?: number;
  heightCm?: number;
  age?: number;
  gender?: string;
  fitnessGoal: string;
  activityLevel?: string;
  isDefaultBaseline?: boolean;
}

export interface DailyTargets {
  totalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  hydrationLiters: number;
}

export interface MacroDistribution {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface StrategyNotes {
  summary: string;
  caloricStrategy: string;
  hydrationAdvice: string;
  mealPacingAdvice: string;
}

export interface PersonalizedPlanData {
  _id?: string;
  userId: string;
  userEmail?: string;
  biometricsSnapshot: BiometricsSnapshot;
  dailyTargets: DailyTargets;
  macroDistribution: MacroDistribution;
  mealTargets: {
    breakfast: MealTargetItem;
    lunch: MealTargetItem;
    dinner: MealTargetItem;
  };
  strategyNotes: StrategyNotes;
  version: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonalizedPlanApiResponse {
  success: boolean;
  message: string;
  data: PersonalizedPlanData | null;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window === "undefined") return headers;

  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const email = localStorage.getItem("fitora_user_email");
    if (email) {
      headers["x-user-email"] = email;
    }

    const userStr = localStorage.getItem("fitora_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        const id = u?._id || u?.id;
        if (id) headers["x-user-id"] = id;
      } catch {}
    }
  } catch {}

  return headers;
}

/**
 * Fetch existing saved plan for the user
 */
export async function fetchPersonalizedNutritionPlan(
  userId?: string
): Promise<PersonalizedPlanData | null> {
  try {
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const res = await fetch(`${API_URL}/personalized-nutrition-plan/me${query}`, {
      method: "GET",
      headers: getAuthHeaders(),
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data: PersonalizedPlanApiResponse = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("[PersonalizedNutritionPlanService] fetch error:", error);
    return null;
  }
}

/**
 * Generate a new rule-based plan and persist to MongoDB
 */
export async function generatePersonalizedNutritionPlanApi(payload?: {
  userId?: string;
  fitnessGoal?: string;
}): Promise<PersonalizedPlanData | null> {
  try {
    const res = await fetch(`${API_URL}/personalized-nutrition-plan/generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload || {}),
    });

    if (!res.ok) return null;

    const data: PersonalizedPlanApiResponse = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("[PersonalizedNutritionPlanService] generate error:", error);
    return null;
  }
}

/**
 * Recalibrate and regenerate the plan
 */
export async function regeneratePersonalizedNutritionPlanApi(payload?: {
  userId?: string;
  fitnessGoal?: string;
}): Promise<PersonalizedPlanData | null> {
  try {
    const res = await fetch(`${API_URL}/personalized-nutrition-plan/regenerate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(payload || {}),
    });

    if (!res.ok) return null;

    const data: PersonalizedPlanApiResponse = await res.json();
    return data.data ?? null;
  } catch (error) {
    console.error("[PersonalizedNutritionPlanService] regenerate error:", error);
    return null;
  }
}
