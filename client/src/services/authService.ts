const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  assignedBranch?: string;
  plan?: string;
  status?: string;
  isMasterAdmin?: boolean;
  isBranchAdmin?: boolean;
  attendanceStreakDays?: number;
  hydrationTargetLiters?: number;
  totalPaidBDT?: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: AuthUser;
}

export const getStoredAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fitora_jwt_token");
};

export const getStoredUserRole = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fitora_active_role");
};

export const saveAuthSession = (token: string, user: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("fitora_jwt_token", token);
  localStorage.setItem("fitora_auth_session", "true");
  localStorage.setItem("fitora_active_role", user.role);
  localStorage.setItem("fitora_user_name", user.name);
  localStorage.setItem("fitora_user_email", user.email);
  if (user.assignedBranch) {
    localStorage.setItem("fitora_assigned_branch", user.assignedBranch);
    localStorage.setItem("fitora_active_branch", user.assignedBranch);
  }
};

export const clearAuthSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("fitora_jwt_token");
  localStorage.removeItem("fitora_auth_session");
  localStorage.removeItem("fitora_active_role");
  localStorage.removeItem("fitora_user_name");
  localStorage.removeItem("fitora_user_email");
  localStorage.removeItem("fitora_assigned_branch");
  localStorage.removeItem("fitora_active_branch");
};

export async function dashboardLoginApi(
  email: string,
  password: string,
  gatewayKey?: string,
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/dashboard-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, gatewayKey }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message:
          data?.message ||
          `Security Gateway rejected with status ${res.status}`,
      };
    }

    if (data?.token && data?.user) {
      saveAuthSession(data.token, data.user);
    }

    return {
      success: true,
      message: data?.message || "Authenticated successfully",
      token: data?.token,
      user: data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.message ||
        "Network error — could not connect to backend security gateway",
    };
  }
}

export async function loginApi(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Login failed with status ${res.status}`,
      };
    }

    if (data?.token && data?.user) {
      saveAuthSession(data.token, data.user);
    }

    return {
      success: true,
      message: data?.message || "Login successful",
      token: data?.token,
      user: data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error — could not reach auth server",
    };
  }
}

export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
  assignedBranch?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message:
          data?.message || `Registration failed with status ${res.status}`,
      };
    }

    if (data?.token && data?.user) {
      saveAuthSession(data.token, data.user);
    }

    return {
      success: true,
      message: data?.message || "Registered successfully",
      token: data?.token,
      user: data?.user,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Network error — could not reach auth server",
    };
  }
}

export async function getCurrentUserApi(): Promise<AuthResponse> {
  try {
    const token = getStoredAuthToken();
    if (!token) {
      return { success: false, message: "No token stored" };
    }

    const res = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Failed to retrieve user profile",
      };
    }

    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, message: error.message || "Network error" };
  }
}
