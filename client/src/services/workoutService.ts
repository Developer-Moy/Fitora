import type {
  CreateWorkoutLogPayload,
  WorkoutLog,
  WorkoutLogSummary,
  WorkoutLogsResult,
} from "@/types/workout";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    if (token) return { Authorization: `Bearer ${token}` };

    const session = localStorage.getItem("fitora_auth_session");
    if (!session) return {};
    const parsed = JSON.parse(session);
    const sessionToken = parsed?.token || parsed?.access_token;
    return sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {};
  } catch {
    return {};
  }
}

export async function createWorkoutLog(
  payload: CreateWorkoutLogPayload
): Promise<WorkoutLog> {
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
    throw new Error("Network error — could not reach the server");
  }

  const result = await parseResponse<WorkoutLog>(response);
  return result.data;
}

export async function updateWorkoutLog(
  id: string,
  payload: Partial<CreateWorkoutLogPayload>
): Promise<WorkoutLog> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/workouts/log/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
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
  limit: number = 50,
  email?: string
): Promise<WorkoutLogsResult> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (userId) params.set("userId", userId);
  if (email) params.set("email", email);

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

  // Server response data may be { logs: [...], count: ..., summary: ... } or an array [...]
  const result = await parseResponse<any>(response);
  const data = result.data;
  const logs: WorkoutLog[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.logs)
    ? data.logs
    : [];
  const summary: WorkoutLogSummary | undefined =
    data?.summary ?? result.summary;

  return { logs, summary };
}

export async function deleteWorkoutLog(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/workouts/log/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
