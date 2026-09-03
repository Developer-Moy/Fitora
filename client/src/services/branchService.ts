const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type Branch = {
  _id: string;
  name: string;
  memberCapacity?: number;
};

export type BranchOccupancy = {
  branchId: string;
  branchName: string;
  memberCapacity: number;
  currentOccupancy: number;
  availableSpots: number;
  occupancyPercent: number;
  isAtCapacity: boolean;
  status: "low" | "moderate" | "high" | "full";
};

export type BranchCheckin = {
  _id: string;
  memberName: string;
  memberEmail: string;
  branchName: string;
  checkInTime: string;
  checkOutTime?: string | null;
  status: string;
  source: string;
  durationMinutes?: number;
};

export type BranchAttendance = {
  branchId: string;
  branchName: string;
  date: string;
  totalCheckins: number;
  activeMembers: number;
  capacity: number;
  occupancyPercent: number;
  checkins: BranchCheckin[];
};

function authHeaders(): HeadersInit {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("fitora_token") ||
        localStorage.getItem("fitora_auth_token")
      : null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readResponse<T>(
  response: Response,
  fallbackMessage: string,
): Promise<T> {
  const body = await response.json().catch(() => null);

  if (!response.ok || !body?.success) {
    throw new Error(body?.message || fallbackMessage);
  }

  return body.data as T;
}

export async function fetchBranchOverview(): Promise<Branch[]> {
  try {
    const response = await fetch(`${API_URL}/branches/admin-overview`, {
      headers: authHeaders(),
    });
    if (response.ok) {
      const data = await readResponse<{ branches?: Branch[] }>(
        response,
        "Failed to fetch branch overview",
      );
      if (data.branches && data.branches.length > 0) {
        return data.branches;
      }
    }
  } catch {
    // Fall back to public branches
  }

  try {
    const pubRes = await fetch(`${API_URL}/branches/public`);
    if (pubRes.ok) {
      const pubData = await pubRes.json();
      const branches = pubData?.data?.branches || pubData?.data || [];
      return Array.isArray(branches) ? branches : [];
    }
  } catch {
    // Return empty array
  }

  return [];
}

export async function fetchBranchOccupancy(
  branchId: string,
): Promise<BranchOccupancy> {
  const response = await fetch(`${API_URL}/branches/${branchId}/occupancy`, {
    headers: authHeaders(),
  });
  return readResponse<BranchOccupancy>(
    response,
    "Failed to fetch branch occupancy",
  );
}

export async function fetchBranchCheckins(
  branchId: string,
): Promise<BranchAttendance> {
  const response = await fetch(`${API_URL}/branches/${branchId}/checkins`, {
    headers: authHeaders(),
  });
  return readResponse<BranchAttendance>(
    response,
    "Failed to fetch branch check-ins",
  );
}
