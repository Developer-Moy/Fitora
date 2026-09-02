const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface NutritionResult {
  tdee: number;
  protein: number;
  carbs: number;
  fats: number;
}

export async function calculateNutritionApi(payload: {
  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;
  activityLevel: number;
}): Promise<NutritionResult | null> {
  try {
    const res = await fetch(`${API_URL}/nutrition/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data ?? null;
  } catch {
    return null;
  }
}
