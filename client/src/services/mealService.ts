/**
 * Meal API Service
 * Connects frontend healthy meals pages to the Fitora backend MongoDB API.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface MealItem {
  id: string;
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
  category?: string;
  _id?: string;
}

export async function fetchMealsApi(params?: {
  search?: string;
  category?: string;
  minCalories?: number;
  maxCalories?: number;
}): Promise<MealItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.category && params.category !== "all")
      query.append("category", params.category);
    if (params?.minCalories)
      query.append("minCalories", String(params.minCalories));
    if (params?.maxCalories)
      query.append("maxCalories", String(params.maxCalories));

    const queryString = query.toString() ? `?${query.toString()}` : "";
    const res = await fetch(`${API_URL}/meals${queryString}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return [];

    const json = await res.json().catch(() => null);
    if (Array.isArray(json?.data)) {
      return json.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching healthy meals from database:", error);
    return [];
  }
}

export async function fetchMealByIdApi(id: string): Promise<MealItem | null> {
  try {
    const res = await fetch(`${API_URL}/meals/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) return null;

    const json = await res.json().catch(() => null);
    return json?.data ?? null;
  } catch (error) {
    console.error("Error fetching meal details:", error);
    return null;
  }
}
