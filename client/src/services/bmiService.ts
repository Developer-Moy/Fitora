/**
 * BMI API Service
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const token =
      localStorage.getItem("fitora_token") ||
      localStorage.getItem("fitora_auth_token");
    if (token) return { Authorization: `Bearer ${token}` };

    const session = localStorage.getItem("fitora_auth_session");
    if (session) {
      try {
        const parsed = JSON.parse(session);
        const sessionToken = parsed?.token || parsed?.access_token;
        if (sessionToken) return { Authorization: `Bearer ${sessionToken}` };
      } catch {}
    }
    return {};
  } catch {
    return {};
  }
}

export async function saveBmiHistory(payload: {
  heightCm: number;
  weightKg: number;
  bmiScore: number;
  statusCategory: string;
  userId?: string;
}): Promise<boolean> {
  try {
    let resolvedUserId = payload.userId;
    if (!resolvedUserId && typeof window !== "undefined") {
      try {
        const userStr = localStorage.getItem("fitora_user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          resolvedUserId = userObj?._id || userObj?.id;
        }
      } catch {}
    }

    const res = await fetch(`${API_URL}/bmi/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify({
        ...payload,
        userId: resolvedUserId,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// Delete BMI History
export async function deleteBmiHistory(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/bmi/history/${id}`, {
      method: "DELETE",
      headers: {
        ...getAuthHeader(),
      },
    });

    return res.ok;
  } catch {
    return false;
  }
}

// Fetch BMI History
export async function fetchBmiHistory(userId?: string): Promise<any[]> {
  try {
    const params = new URLSearchParams();
    if (userId) params.set("userId", userId);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_URL}/bmi/history${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data?.history)
      ? data.data.history
      : Array.isArray(data?.data)
        ? data.data
        : [];
  } catch {
    return [];
  }
}
