import type {
  CreateWorkoutLogPayload,
  WorkoutLog,
  WorkoutLogSummary,
  WorkoutLogsResult,
} from "@/types/workout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

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

async function parseResponse<T>(response: Response): Promise<ApiSuccessResponse<T>> {
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
        `Request failed with status ${response.status}`
    );
  }

  if (!result || !("success" in result) || !result.success) {
    throw new Error(
      (result && "message" in result && result.message) || "Unexpected server response"
    );
  }

  return result as ApiSuccessResponse<T>;
}

export async function createWorkoutLog(
  payload: CreateWorkoutLogPayload
): Promise<WorkoutLog> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/workouts/log`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Network error — could not reach the server");
  }

  const result = await parseResponse<WorkoutLog>(response);
  return result.data;
}

export async function getWorkoutLogs(
  userId?: string,
  limit: number = 50
): Promise<WorkoutLogsResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (userId) params.set("userId", userId);

  let response: Response;
  try {
    response = await fetch(`${API_URL}/workouts/log?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    throw new Error("Network error — could not reach the server");
  }

  const result = await parseResponse<WorkoutLog[]>(response);
  return { logs: Array.isArray(result.data) ? result.data : [], summary: result.summary };
}
