import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface AuthUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
  assignedBranch?: string;
  status?: string;
  avatarUrl?: string;
  image?: string;
  phone?: string;
  gender?: string;
  weight?: string;
  height?: string;
  bio?: string;
  fitnessGoal?: string;
  activityLevel?: string;
  joinedDate?: string;
  isMasterAdmin?: boolean;
  isBranchAdmin?: boolean;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

/**
 * 1. Enterprise Security Gateway Login for /dashboard/login
 */
export async function dashboardLoginApi(
  email: string,
  secretPass: string,
): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/dashboard-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, secretPass }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message:
          data?.message || "Invalid credentials or unauthorized clearance",
      };
    }

    const authData = data.data;
    if (authData?.token) {
      saveAuthSession(authData.token, authData.user);
    }

    return {
      success: true,
      message: data.message || "Dashboard authentication authorized",
      token: authData?.token,
      user: authData?.user,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return {
      success: false,
      message: "Network error — Could not connect to authentication gateway",
    };
  }
}

/**
 * 2. Public Login (/login)
 */
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

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Invalid email or password",
      };
    }

    const authData = data.data;
    if (authData?.token) {
      saveAuthSession(authData.token, authData.user);
    }

    return {
      success: true,
      message: data.message || "Login successful",
      token: authData?.token,
      user: authData?.user,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return {
      success: false,
      message: "Network error — Could not reach login server",
    };
  }
}

/**
 * 3. Public User Registration (/register)
 */
export async function registerApi(payload: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  assignedBranch?: string;
}): Promise<AuthResponse> {
  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return {
        success: false,
        message: data?.message || "Registration failed. Please try again.",
      };
    }

    const authData = data.data;
    if (authData?.token) {
      saveAuthSession(authData.token, authData.user);
    }

    return {
      success: true,
      message: data.message || "Registration successful",
      token: authData?.token,
      user: authData?.user,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return {
      success: false,
      message: "Network error — Could not complete registration",
    };
  }
}

/**
 * 4. Get Current User Profile (/api/auth/me)
 */
export async function getCurrentUserApi(): Promise<AuthResponse> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("fitora_token")
        : null;
    if (!token) {
      return { success: false, message: "No active token found" };
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
      return { success: false, message: "Session expired" };
    }

    return {
      success: true,
      message: "User verified",
      user: data.data?.user,
      token,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return { success: false, message: "Could not fetch user claims" };
  }
}

/**
 * Session persistence helpers
 */
export function saveAuthSession(token: string, user?: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("fitora_token", token);
  localStorage.setItem("fitora_auth_token", token);
  if (user) {
    localStorage.setItem("fitora_user", JSON.stringify(user));
    if (user.role) localStorage.setItem("fitora_user_role", user.role);
    if (user.email) localStorage.setItem("fitora_user_email", user.email);
    if (user.name) localStorage.setItem("fitora_user_name", user.name);
  }
}

export function getAuthSession(): {
  token: string | null;
  user: AuthUser | null;
} {
  if (typeof window === "undefined") return { token: null, user: null };
  const token =
    localStorage.getItem("fitora_token") ||
    localStorage.getItem("fitora_auth_token");
  const userStr = localStorage.getItem("fitora_user");
  let user = null;
  if (userStr) {
    try {
      user = JSON.parse(userStr);
    } catch {
      user = null;
    }
  }
  return { token, user };
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("fitora_token");
  localStorage.removeItem("fitora_auth_token");
  localStorage.removeItem("fitora_user");
  localStorage.removeItem("fitora_user_role");
  localStorage.removeItem("fitora_user_email");
  localStorage.removeItem("fitora_user_name");
  localStorage.removeItem("fitora_auth_session");
  localStorage.removeItem("fitora_active_role");
  localStorage.removeItem("fitora_google_auth_token");
  sessionStorage.clear();

  try {
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
  } catch { }
}

export async function logoutUser(): Promise<void> {
  try {
    await authClient.signOut().catch(() => null);
  } catch { }
  clearAuthSession();
}

export default {
  dashboardLoginApi,
  loginApi,
  registerApi,
  getCurrentUserApi,
  saveAuthSession,
  getAuthSession,
  clearAuthSession,
  logoutUser,
};
