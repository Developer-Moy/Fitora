/**
 * Exercise API Service
 * Connects frontend components to the Fitora backend API
 * for exercises and user favorite/regular routines.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface APIExercise {
  _id: string;
  id?: number;
  name: string;
  category: string;
  muscle: string;
  equipment: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
}

export interface SavedFavoriteExercise {
  _id: string;
  userId: string;
  exerciseId: string;
  name: string;
  category: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    const email = localStorage.getItem("fitora_user_email");
    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (email) headers["x-user-email"] = email;
  }
  return headers;
}

export async function fetchExercises(params?: {
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
}): Promise<APIExercise[] | null> {
  try {
    const query = new URLSearchParams();
    if (params?.muscleGroup) query.append("muscleGroup", params.muscleGroup);
    if (params?.equipment) query.append("equipment", params.equipment);
    if (params?.difficulty) query.append("difficulty", params.difficulty);

    const res = await fetch(`${API_URL}/exercises?${query.toString()}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return null;
  }
}

/**
 * Fetch favorite exercises for the current user from backend profile database
 */
export async function fetchFavoriteExercises(
  userId?: string
): Promise<SavedFavoriteExercise[]> {
  try {
    const headers = getAuthHeaders();
    const endpoint = userId
      ? `${API_URL}/exercises/favorites/${encodeURIComponent(userId)}`
      : `${API_URL}/exercises/favorites`;

    const res = await fetch(endpoint, {
      method: "GET",
      headers,
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (error) {
    console.error("Failed to fetch favorite exercises:", error);
    return [];
  }
}

/**
 * Toggle favorite status of an exercise in user's profile database
 */
export async function toggleFavoriteExerciseApi(payload: {
  userId: string;
  exerciseId: string;
  exerciseData?: any;
}): Promise<{
  success: boolean;
  isFavorited: boolean;
  data?: any;
  message?: string;
}> {
  try {
    const headers = getAuthHeaders();
    const res = await fetch(`${API_URL}/exercises/favorites/toggle`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const json = await res.json().catch(() => ({
      success: false,
      message: "Server response error",
    }));

    if (!res.ok) {
      return {
        success: false,
        isFavorited: false,
        message: json.message || "Failed to update favorite status",
      };
    }

    return {
      success: true,
      isFavorited: !!json.data?.isFavorited,
      data: json.data?.exercise || json.data,
      message: json.message,
    };
  } catch (error) {
    console.error("Failed to toggle favorite exercise:", error);
    return {
      success: false,
      isFavorited: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}

/**
 * Remove an exercise from favorites
 */
export async function removeFavoriteExerciseApi(
  exerciseId: string,
  userId?: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const headers = getAuthHeaders();
    const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const res = await fetch(
      `${API_URL}/exercises/favorites/${encodeURIComponent(exerciseId)}${query}`,
      {
        method: "DELETE",
        headers,
      }
    );

    const json = await res.json().catch(() => ({
      success: false,
      message: "Server response error",
    }));

    return {
      success: res.ok && json.success,
      message: json.message,
    };
  } catch (error) {
    console.error("Failed to remove favorite exercise:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network error",
    };
  }
}
