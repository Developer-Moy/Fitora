/**
 * BMI API Service
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const session = localStorage.getItem("fitora_auth_session");
    if (!session) return {};
    const parsed = JSON.parse(session);
    const token = parsed?.token || parsed?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export async function saveBmiHistory(payload: {
  heightCm: number;
  weightKg: number;
  bmiScore: number;
  statusCategory: string;
}): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/bmi/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
