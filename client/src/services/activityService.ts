/**
 * Activity & Consistency Streak Service
 * Connects frontend to the authoritative server-side streak engine
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface ActivityHeatmapDay {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: 0 | 1 | 2 | 3;
  workouts: number;
  checkins: number;
  stopwatch: number;
  minutes: number;
  calories: number;
}

export interface ActivityMilestone {
  id: string;
  name: string;
  targetDays: number;
  achieved: boolean;
  icon: string;
}

export interface UserActivityStreakData {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  totalWorkouts: number;
  totalCheckins: number;
  totalStopwatchSessions: number;
  totalMinutes: number;
  totalCaloriesBurned: number;
  consistencyScore: number;
  todayActive: boolean;
  lastActiveDate: string | null;
  milestones: ActivityMilestone[];
  nextMilestone: {
    name: string;
    targetDays: number;
    daysLeft: number;
  };
  heatmapDays: ActivityHeatmapDay[];
}

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

function getAuthHeaders(userEmail?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    try {
      const token =
        localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token") ||
        localStorage.getItem("token");

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const email =
        userEmail ||
        localStorage.getItem("fitora_user_email") ||
        localStorage.getItem("user_email");

      if (email) {
        headers["x-user-email"] = email;
      }
    } catch {
      // Ignore storage errors
    }
  }

  return headers;
}

/**
 * Fetch authenticated user's real-time workout activity, consistency streak, and heatmap history
 */
export async function fetchUserActivityStreakApi(
  userId?: string,
  userEmail?: string,
): Promise<UserActivityStreakData> {
  const headers = getAuthHeaders(userEmail);
  const queryParams = new URLSearchParams();
  if (userId) queryParams.append("userId", userId);
  if (userEmail) queryParams.append("email", userEmail);

  const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const endpoints = [
    `${API_URL}/users/activity/streak${qs}`,
    `${API_URL}/dashboard/activity/streak${qs}`,
    `${API_URL}/users/activity-streak${qs}`,
  ];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: "GET",
        headers,
      });

      if (!res.ok) {
        if (res.status === 404) continue;
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || `HTTP ${res.status}`);
      }

      const json = (await res.json()) as ApiResponse<UserActivityStreakData>;
      if (json.success && json.data) {
        return json.data;
      }
    } catch (err: any) {
      // Try next alias
    }
  }

  // Graceful dynamic fallback if offline or initial load
  return {
    currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0,
    totalWorkouts: 0,
    totalCheckins: 0,
    totalStopwatchSessions: 0,
    totalMinutes: 0,
    totalCaloriesBurned: 0,
    consistencyScore: 0,
    todayActive: false,
    lastActiveDate: null,
    milestones: [
      { id: "starter", name: "First Step", targetDays: 1, achieved: false, icon: "👟" },
      { id: "streak_3", name: "3-Day Fire", targetDays: 3, achieved: false, icon: "🔥" },
      { id: "streak_7", name: "Weekly Warrior", targetDays: 7, achieved: false, icon: "⚡" },
      { id: "streak_14", name: "Fortnight Beast", targetDays: 14, achieved: false, icon: "🏆" },
      { id: "streak_30", name: "Monthly Master", targetDays: 30, achieved: false, icon: "👑" },
    ],
    nextMilestone: {
      name: "First Step",
      targetDays: 1,
      daysLeft: 1,
    },
    heatmapDays: Array.from({ length: 180 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (179 - i));
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return {
        date: `${y}-${m}-${day}`,
        count: 0,
        level: 0,
        workouts: 0,
        checkins: 0,
        stopwatch: 0,
        minutes: 0,
        calories: 0,
      };
    }),
  };
}

