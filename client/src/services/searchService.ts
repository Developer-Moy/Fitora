const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  type: "athlete" | "branch" | "financial" | "telemetry";
  category: "Athletes" | "Branches" | "Financials" | "Telemetry";
  path: string;
  details?: Record<string, any>;
}

export interface SearchResponseData {
  query: string;
  totalCount: number;
  athletes: SearchResultItem[];
  branches: SearchResultItem[];
  financials: SearchResultItem[];
  telemetry: SearchResultItem[];
}

export async function fetchGlobalSearch(
  query: string,
): Promise<SearchResponseData> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: "",
      totalCount: 0,
      athletes: [],
      branches: [],
      financials: [],
      telemetry: [],
    };
  }

  try {
    const res = await fetch(
      `${API_URL}/search?q=${encodeURIComponent(trimmed)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Search request failed with status ${res.status}`);
    }

    const data = await res.json();
    if (data && data.data) {
      return data.data as SearchResponseData;
    }

    return {
      query: trimmed,
      totalCount: 0,
      athletes: [],
      branches: [],
      financials: [],
      telemetry: [],
    };
  } catch (error) {
    console.error("Backend search API error:", error);
    return {
      query: trimmed,
      totalCount: 0,
      athletes: [],
      branches: [],
      financials: [],
      telemetry: [],
    };
  }
}
