const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const session = localStorage.getItem("fitora_auth_session");
    if (!session) return {};
    const parsed = JSON.parse(session);
    const token = parsed?.token || parsed?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
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

export async function fetchStopwatchPresets(): Promise<StopwatchPreset[]> {
  try {
    const res = await fetch(`${API_URL}/stopwatch/presets`, { cache: "no-store" });
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

export async function completeStopwatchSession(payload: {
  workoutType?: string;
  durationMinutes: number;
  weightKg?: number;
  caloriesBurned?: number;
  presetId?: string;
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

export async function fetchRecentSessions(limit = 10) {
  try {
    const res = await fetch(`${API_URL}/stopwatch/recent-sessions?limit=${limit}`, {
      headers: { "Content-Type": "application/json", ...getAuthHeader() },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data?.sessions ?? [];
  } catch {
    return [];
  }
}
