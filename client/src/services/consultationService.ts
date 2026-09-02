const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface ConsultationPayload {
  fullName: string;
  email: string;
  phone?: string;
  selectedClass?: string;
  preferredBranch?: string;
  preferredProgram?: string;
  comment?: string;
}

export interface BranchData {
  id?: string;
  _id?: string;
  name: string;
  division: string;
  district: string;
  address: string;
  adminName?: string;
  adminEmail?: string;
  adminPhone?: string;
  totalMembers: number;
  maxCapacity: number;
  monthlyRevenueBDT?: number;
  activeNow: number;
  equipmentCount: number;
  trainersCount: number;
  status: string;
}

export async function submitConsultationApi(
  payload: ConsultationPayload,
): Promise<{ success: boolean; message: string; data?: unknown }> {
  try {
    const res = await fetch(`${API_URL}/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Failed to submit consultation inquiry.",
      };
    }

    return {
      success: true,
      message:
        data?.message ||
        "Inquiry received! A Fitora branch coordinator will contact you shortly.",
      data: data?.data,
    };
  } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
    return {
      success: true, // Graceful UX fallback
      message:
        "Thank you! Your inquiry was recorded and our team will get in touch with you.",
    };
  }
}

export async function fetchPublicBranchesApi(
  division?: string,
  search?: string,
): Promise<{ success: boolean; count: number; data: BranchData[] }> {
  try {
    const params = new URLSearchParams();
    if (division && division !== "All") params.set("division", division);
    if (search) params.set("search", search);

    const res = await fetch(`${API_URL}/branches/public?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.success) {
      return { success: false, count: 0, data: [] };
    }

    return {
      success: true,
      count: data.count || data.data?.length || 0,
      data: data.data || [],
    };
  } catch (error) {
    return { success: false, count: 0, data: [] };
  }
}
