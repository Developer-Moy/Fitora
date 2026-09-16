import type {
  CreateWorkoutLogPayload,
  WorkoutLog,
  WorkoutLogSummary,
  WorkoutLogsResult,
} from "@/types/workout";

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

interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  count?: number;
  summary?: WorkoutLogSummary;
}

interface ApiErrorResponse {
  success: false;
  message?: string;
}

async function parseResponse<T>(
  response: Response,
): Promise<ApiSuccessResponse<T>> {
  const result = (await response.json().catch(() => null)) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse
    | null;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please sign in to continue.");
    }
    throw new Error(
      (result && "message" in result && result.message) ||
        `Request failed with status ${response.status}`,
    );
  }

  if (!result || !("success" in result) || !result.success) {
    throw new Error(
      (result && "message" in result && result.message) ||
        "Unexpected server response",
    );
  }

  return result as ApiSuccessResponse<T>;
}

import { enqueueTelemetry, getPendingQueue } from "./offlineQueueService";

export async function createWorkoutLog(
  payload: CreateWorkoutLogPayload,
  options?: { skipOfflineQueue?: boolean },
): Promise<WorkoutLog> {
  const isOffline = typeof window !== "undefined" && !navigator.onLine;

  if (isOffline && !options?.skipOfflineQueue) {
    await enqueueTelemetry("WORKOUT_LOG", payload);
    return createOptimisticWorkoutLog(payload);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/workouts/log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
  } catch {
    if (!options?.skipOfflineQueue) {
      await enqueueTelemetry("WORKOUT_LOG", payload);
      return createOptimisticWorkoutLog(payload);
    }
    throw new Error("Network error — could not reach the server");
  }

  const result = await parseResponse<WorkoutLog>(response);
  return result.data;
}

function createOptimisticWorkoutLog(payload: CreateWorkoutLogPayload): WorkoutLog {
  const estimatedCalories =
    payload.caloriesBurned ??
    Math.round(
      (payload.setsCount || 1) * (payload.repsCount || 10) * 0.4 +
        (payload.durationMinutes ? payload.durationMinutes * 5 : 10),
    );

  const optimistic: WorkoutLog = {
    _id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    exerciseName: payload.exerciseName,
    setsCount: payload.setsCount,
    repsCount: payload.repsCount,
    weight: payload.weight,
    durationMinutes: payload.durationMinutes,
    notes: payload.notes,
    caloriesBurned: estimatedCalories,
    date: payload.date || new Date().toISOString(),
    userId: payload.userId,
  };

  // Dispatch event so local history & heatmap update optimistically
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("fitora-workout-logged", {
        detail: {
          userId: payload.userId,
          exerciseName: payload.exerciseName,
          date: optimistic.date,
          isOffline: true,
        },
      }),
    );
  }

  return optimistic;
}

export async function getPendingOfflineWorkoutLogs(): Promise<WorkoutLog[]> {
  try {
    const queue = await getPendingQueue();
    return queue
      .filter((item) => item.type === "WORKOUT_LOG")
      .map((item) => createOptimisticWorkoutLog(item.payload));
  } catch {
    return [];
  }
}

export async function getWorkoutLogs(
  userId?: string,
  limit: number = 50,
): Promise<WorkoutLogsResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (userId) params.set("userId", userId);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/workouts/log?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
  } catch {
    throw new Error("Network error — could not reach the server");
  }

  const result = await parseResponse<any>(response);
  const data = result.data;
  const logs = Array.isArray(data?.logs)
    ? data.logs
    : Array.isArray(data)
      ? data
      : [];
  const summary = data?.summary || result.summary;
  return { logs, summary };
}

export async function deleteWorkoutLog(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/workouts/log/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getPRHistory(exerciseId: string): Promise<any[]> {
  try {
    const res = await fetch(`${API_URL}/workouts/pr-history/${exerciseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

export {
  getHeatmapData,
  type HeatmapDaySummary,
  type HeatmapDataResult,
} from "./heatmapService";
