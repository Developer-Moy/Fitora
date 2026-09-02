const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface MealChart {
  _id: string;
  userId: string;
  profile: {
    age: number;
    gender: string;
    height: number;
    weight: number;
    activityLevel: string;
  };
  goals: {
    targetWeight: number;
    fitnessGoal: string;
    targetCalories: number;
  };
  dietary: {
    restrictions: string[];
    allergies: string[];
  };
  structure: {
    mealsPerDay: number;
    distribution: any[];
  };
  createdAt: string;
}

export async function fetchMealCharts(userId: string): Promise<MealChart[]> {
  try {
    const res = await fetch(`${API_URL}/meal-charts?userId=${encodeURIComponent(userId)}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}
