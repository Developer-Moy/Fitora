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

export interface CreateMealPayload {
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
  category?: string;
}

/**
 * POST /api/meals
 * Requires an admin or branch_admin auth token.
 */
export async function createMealApi(
  payload: CreateMealPayload,
  token?: string | null,
): Promise<MealItem> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/meals`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message || `Failed to create meal (${res.status})`);
  }

  return json.data as MealItem;
}
