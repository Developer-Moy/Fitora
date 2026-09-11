const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    if (token) return { Authorization: `Bearer ${token}` };

    const session = localStorage.getItem("fitora_auth_session");
    if (session) {
      const parsed = JSON.parse(session);
      const sessToken = parsed?.token || parsed?.access_token;
      if (sessToken) return { Authorization: `Bearer ${sessToken}` };
    }
    return {};
  } catch {
    return {};
  }
}

export interface StopwatchPreset {
  _id: string;
  name: string;
  workDuration: number;
  restDuration: number;
  rounds: number;
  warmupDuration?: number;
  cooldownDuration?: number;
  type: string;
  isPublic: boolean;
}

export interface CustomRestPreset {
  _id: string;
  name: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export async function fetchStopwatchPresets(): Promise<StopwatchPreset[]> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/presets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchUserPresets(): Promise<StopwatchPreset[]> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/user-presets`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function createCustomPreset(payload: {
  name: string;
  workDuration: number;
  restDuration: number;
  rounds: number;
  warmup?: number;
  cooldown?: number;
}): Promise<StopwatchPreset | null> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/custom-preset`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export interface StopwatchSessionRecord {
  _id: string;
  userId: string;
  presetId?: string;
  workoutType?: string;
  durationMinutes: number;
  durationSeconds?: number;
  setsCount?: number;
  repsCount?: number;
  weightKg?: number;
  caloriesBurned?: number;
  notes?: string;
  completedAt: string;
}

export interface RecentSessionsData {
  count: number;
  sessions: StopwatchSessionRecord[];
  todayGymSeconds: number;
  todayCaloriesBurned: number;
  todaySessionsCount: number;
  todaySetsCount: number;
}

export async function completeStopwatchSession(payload: {
  workoutType?: string;
  durationMinutes?: number;
  durationSeconds?: number;
  setsCount?: number;
  repsCount?: number;
  weightKg?: number;
  caloriesBurned?: number;
  presetId?: string;
  notes?: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/session-complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRecentSessions(
  limit = 10,
): Promise<RecentSessionsData | null> {
  try {
    const res = await fetch(
      `${API_URL}/stopwatch/recent-sessions?limit=${limit}`,
      {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        cache: "no-store",
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data) return null;
    return {
      count: data.data.count ?? (data.data.sessions?.length || 0),
      sessions: data.data.sessions ?? [],
      todayGymSeconds: data.data.todayGymSeconds ?? 0,
      todayCaloriesBurned: data.data.todayCaloriesBurned ?? 0,
      todaySessionsCount: data.data.todaySessionsCount ?? 0,
      todaySetsCount: data.data.todaySetsCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function syncDailyGymTime(totalSeconds: number): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/sync-time`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify({ totalSeconds }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function resetDailyGymTime(): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/reset-today`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRestPresets(): Promise<CustomRestPreset[]> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/rest-presets`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export async function createRestPreset(payload: {
  name: string;
  duration: number;
}): Promise<CustomRestPreset | null> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/rest-preset`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}

export async function deleteRestPreset(id: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${API_URL}/stopwatch/rest-preset/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
      },
    );
    return res.ok;
  } catch {
    return false;
  }
}
