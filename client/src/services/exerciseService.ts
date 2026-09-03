/**
 * Exercise API Service
 * Connects frontend components to the Fitora backend API
 * for exercises.
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
