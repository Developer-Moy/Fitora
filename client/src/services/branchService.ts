const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

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

async function readResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
    const body = await response.json().catch(() => null);

    if (!response.ok || !body?.success) {
        throw new Error(body?.message || fallbackMessage);
    }

    return body.data as T;
}

export async function fetchBranchOverview(): Promise<Branch[]> {
    const response = await fetch(`${API_URL}/branches/admin-overview`, {
        headers: authHeaders(),
    });
    const data = await readResponse<{ branches?: Branch[] }>(
        response,
        "Failed to fetch branch overview",
    );

    return data.branches ?? [];
}

export async function fetchBranchOccupancy(branchId: string): Promise<BranchOccupancy> {
    const response = await fetch(`${API_URL}/branches/${branchId}/occupancy`, {
        headers: authHeaders(),
    });
    return readResponse<BranchOccupancy>(response, "Failed to fetch branch occupancy");
}

export async function fetchBranchCheckins(branchId: string): Promise<BranchAttendance> {
    const response = await fetch(`${API_URL}/branches/${branchId}/checkins`, {
        headers: authHeaders(),
    });
    return readResponse<BranchAttendance>(response, "Failed to fetch branch check-ins");
}
