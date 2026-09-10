export interface HeatmapDaySummary {
  date: string; // "YYYY-MM-DD"
  count: number;
  exercises: string[];
  totalDuration?: number;
  totalCalories?: number;
}

export interface HeatmapDataResult {
  userId: string;
  year: number;
  totalWorkoutsInYear: number;
  activeDaysInYear: number;
  currentStreak: number;
  availableYears: number[];
  days: HeatmapDaySummary[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/**
 * Fetch aggregated heatmap activity for a user and specific year.
 */
export async function getHeatmapData(
  userId?: string,
  year?: number
): Promise<HeatmapDataResult> {
  const currentYear = new Date().getFullYear();
  const targetYear = year || currentYear;

  const params = new URLSearchParams({ year: String(targetYear) });
  if (userId) params.set("userId", userId);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/heatmap?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
  } catch {
    throw new Error("Network error — could not reach the heatmap service");
  }

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to load heatmap data");
  }

  const data = result.data;
  return {
    userId: data?.userId || userId || "guest_user",
    year: data?.year || targetYear,
    totalWorkoutsInYear: Number(data?.totalWorkoutsInYear) || 0,
    activeDaysInYear: Number(data?.activeDaysInYear) || 0,
    currentStreak: Number(data?.currentStreak) || 0,
    availableYears: Array.isArray(data?.availableYears) && data.availableYears.length > 0
      ? data.availableYears
      : [targetYear, targetYear - 1],
    days: Array.isArray(data?.days) ? data.days : [],
  };
}

/**
 * Record an activity immediately on the backend without requiring validation or full session.
 */
export async function recordHeatmapActivity(payload: {
  userId?: string;
  exerciseName?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  date?: string | Date;
}): Promise<unknown> {
  try {
    const response = await fetch(`${API_URL}/heatmap/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        userId: payload.userId || "guest_user",
        exerciseName: payload.exerciseName || "Workout",
        durationMinutes: payload.durationMinutes || 1,
        caloriesBurned: payload.caloriesBurned || 10,
        date: payload.date || new Date().toISOString(),
      }),
    });
    return await response.json().catch(() => null);
  } catch (err) {
    console.warn("[heatmapService] Failed to record activity:", err);
    return null;
  }
}

