const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface MealPayload {
  id: string;
  name: string;
  calories: number;
  description: string;
  ingredients: string[];
  img: string;
}

export interface DailyPlanResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

/**
 * Sends a POST request to /api/daily-plan to save the selected meal
 * for the given user. userId is sourced from any available auth method
 * (Better Auth session, localStorage, etc.) and passed explicitly.
 */
export async function addMealToDailyPlan(
  meal: MealPayload,
  userId: string
): Promise<DailyPlanResponse> {
  const res = await fetch(`${API_URL}/daily-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      mealId: meal.id,
      name: meal.name,
      calories: meal.calories,
      description: meal.description,
      ingredients: meal.ingredients,
      img: meal.img,
    }),
  });

  const data: DailyPlanResponse = await res.json().catch(() => ({
    success: false,
    message: "Unexpected server response",
  }));

  return data;
}
