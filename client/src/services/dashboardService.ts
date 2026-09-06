/**
 * Dashboard API Service
 * Connects frontend components to the Fitora backend API
 * for user management and platform analytics.
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
      const parsed = JSON.parse(session);
      const sessToken = parsed?.token || parsed?.access_token;
      if (sessToken) return { Authorization: `Bearer ${sessToken}` };
    }
    return {};
  } catch {
    return {};
  }
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "master_admin" | "branch_admin" | "premium_user" | "free_user";
  assignedBranch: string;
  plan: "Free Pass" | "Basic Pass" | "Pro Athlete" | "VIP Ultimate";
  status: "active" | "suspended" | "pending";
  joinDate: string;
  expiryDate: string;
  totalPaidBDT: number;
  paymentMethod: "bKash" | "Nagad" | "Card" | "None";
  attendanceStreakDays: number;
  lastCheckIn: string;
  qrCodeId: string;
}

export interface PlatformStats {
  totalRevenueBDT: number;
  mrrBDT: number;
  totalMembers: number;
  activeMembersToday: number;
  totalBranches: number;
  conversionRatePercent: number;
  revenueGrowthPercent: number;
  membersGrowthPercent: number;
}

export interface CheckInRecord {
  id: string;
  userName: string;
  userRole: string;
  branchName: string;
  time: string;
  status: string;
  method: string;
}

export interface PaymentGatewayBreakdown {
  name: string;
  percentage: number;
  amountBDT: number;
  color: string;
}

export interface PackageSalesBreakdown {
  name: string;
  members: number;
  priceBDT: number;
  share: string;
}

export interface PlatformStatsResponse {
  platformStats: PlatformStats;
  paymentGatewayBreakdown: PaymentGatewayBreakdown[];
  packageSalesBreakdown: PackageSalesBreakdown[];
  recentCheckIns: CheckInRecord[];
}

export interface BranchInfo {
  id: string;
  name: string;
  division: string;
  district: string;
  address: string;
  adminName: string;
  adminEmail?: string;
  adminPhone?: string;
  totalMembers: number;
  maxCapacity: number;
  monthlyRevenueBDT: number;
  activeNow: number;
  equipmentCount: number;
  trainersCount: number;
  status: "active" | "maintenance" | "upcoming";
}

// ── Platform Stats ────────────────────────────────────────────────────────────

export async function fetchPlatformStats(): Promise<PlatformStatsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/dashboard/platform-stats`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

// ── User Management ───────────────────────────────────────────────────────────

export async function fetchAllUsers(params?: {
  role?: string;
  status?: string;
  branch?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ users: UserRecord[]; total: number; totalPages: number } | null> {
  try {
    const query = new URLSearchParams();
    if (params?.role && params.role !== "all")
      query.append("role", params.role);
    if (params?.status && params.status !== "all")
      query.append("status", params.status);
    if (params?.branch && params.branch !== "all")
      query.append("branch", params.branch);
    if (params?.search) query.append("search", params.search);
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));

    const res = await fetch(`${API_URL}/dashboard/users?${query.toString()}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function createUserAPI(
  userData: Partial<UserRecord>,
): Promise<{ id: string; name: string } | null> {
  try {
    const res = await fetch(`${API_URL}/dashboard/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(userData),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || null;
  } catch {
    return null;
  }
}

export async function updateUserAPI(
  id: string,
  updates: Partial<UserRecord>,
): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/dashboard/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      body: JSON.stringify(updates),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteUserAPI(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/dashboard/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ── Branches ──────────────────────────────────────────────────────────────────

export async function fetchAdminBranches(): Promise<BranchInfo[] | null> {
  try {
    const res = await fetch(`${API_URL}/branches/admin-overview`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.data?.branches || [];
    // Normalize _id → id
    return raw.map((b: any) => ({
      ...b,
      id:
        b._id ||
        b.id ||
        `BR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      adminEmail: b.adminEmail || b.email || "",
      adminPhone: b.adminPhone || b.phone || "",
      totalMembers: b.totalMembers || 0,
      maxCapacity: b.maxCapacity || b.memberCapacity || 0,
      activeNow: b.activeNow || 0,
      equipmentCount: b.equipmentCount || b.facilities?.length || 0,
      trainersCount: b.trainersCount || b.trainerCount || 0,
      monthlyRevenueBDT: b.monthlyRevenueBDT || 0,
    }));
  } catch {
    return null;
  }
}

export async function fetchPublicBranches(params?: {
  division?: string;
  search?: string;
}): Promise<BranchInfo[] | null> {
  try {
    const query = new URLSearchParams();
    if (params?.division && params.division !== "All")
      query.append("division", params.division);
    if (params?.search) query.append("search", params.search);

    const res = await fetch(`${API_URL}/branches/public?${query.toString()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    const raw = data.data?.branches || [];
    return raw.map((b: any) => ({
      ...b,
      id:
        b._id ||
        b.id ||
        `BR-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      adminEmail: b.adminEmail || b.email || "",
      adminPhone: b.adminPhone || b.phone || "",
      totalMembers: b.totalMembers || 0,
      maxCapacity: b.maxCapacity || b.memberCapacity || 0,
      activeNow: b.activeNow || 0,
      equipmentCount: b.equipmentCount || b.facilities?.length || 0,
      trainersCount: b.trainersCount || b.trainerCount || 0,
      monthlyRevenueBDT: b.monthlyRevenueBDT || 0,
    }));
  } catch {
    return null;
  }
}

export interface MemberStatsResponse {
  workoutsThisMonth: number;
  caloriesBurned: number;
  streakDays: number;
  targetWorkouts: number;
  consistencyScore: number;
}

export async function fetchMemberStats(): Promise<MemberStatsResponse | null> {
  try {
    const res = await fetch(`${API_URL}/dashboard`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeader(),
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}
