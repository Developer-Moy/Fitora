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
  query: string
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
      }
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
    console.warn("Backend search API error, applying local search fallback:", error);
    // Local fallback for offline / mock testing
    return executeLocalFallbackSearch(trimmed);
  }
}

// Resilient local fallback search if backend server is offline
function executeLocalFallbackSearch(query: string): SearchResponseData {
  const q = query.toLowerCase();

  const MOCK_ATHLETES: SearchResultItem[] = [
    {
      id: "u1",
      title: "Tanvir Ahmed",
      subtitle: "tanvir.ahmed@gmail.com • Gulshan-2, Dhaka (VIP Ultimate)",
      badge: "premium_user",
      type: "athlete",
      category: "Athletes",
      path: "/dashboard?tab=athletes&user=Tanvir%20Ahmed",
    },
    {
      id: "u2",
      title: "Sadia Rahman",
      subtitle: "sadia.fitness@yahoo.com • Dhanmondi, Dhaka (Pro Athlete)",
      badge: "premium_user",
      type: "athlete",
      category: "Athletes",
      path: "/dashboard?tab=athletes&user=Sadia%20Rahman",
    },
    {
      id: "u3",
      title: "Mahmudul Hasan",
      subtitle: "mahmud.dev@fitora.io • Agrabad, Chittagong (Pro Athlete)",
      badge: "premium_user",
      type: "athlete",
      category: "Athletes",
      path: "/dashboard?tab=athletes&user=Mahmudul%20Hasan",
    },
    {
      id: "u4",
      title: "Nusrat Jahan",
      subtitle: "nusrat.gym@gmail.com • Uttara, Dhaka (Basic Pass)",
      badge: "free_user",
      type: "athlete",
      category: "Athletes",
      path: "/dashboard?tab=athletes&user=Nusrat%20Jahan",
    },
  ];

  const MOCK_BRANCHES: SearchResultItem[] = [
    {
      id: "b1",
      title: "Fitora Flagship Tower (Gulshan-2)",
      subtitle: "Dhaka, Dhaka • Mgr: Rafiqul Islam",
      badge: "active",
      type: "branch",
      category: "Branches",
      path: "/dashboard?tab=branches&branch=Gulshan-2",
    },
    {
      id: "b2",
      title: "Fitora Agrabad Club",
      subtitle: "Chittagong, Chittagong • Mgr: Shahidul Alam",
      badge: "active",
      type: "branch",
      category: "Branches",
      path: "/dashboard?tab=branches&branch=Agrabad",
    },
    {
      id: "b3",
      title: "Fitora Dhanmondi Studio",
      subtitle: "Dhaka, Dhaka • Mgr: Farhana Kabir",
      badge: "active",
      type: "branch",
      category: "Branches",
      path: "/dashboard?tab=branches&branch=Dhanmondi",
    },
    {
      id: "b4",
      title: "Fitora Zindabazar Hub",
      subtitle: "Sylhet, Sylhet • Mgr: Kamrul Hasan",
      badge: "active",
      type: "branch",
      category: "Branches",
      path: "/dashboard?tab=branches&branch=Sylhet",
    },
  ];

  const MOCK_FINANCIALS: SearchResultItem[] = [
    {
      id: "f1",
      title: "Total Platform Revenue",
      subtitle: "$182,450 YTD Revenue Overview",
      type: "financial",
      category: "Financials",
      path: "/dashboard?tab=revenue",
    },
    {
      id: "f2",
      title: "bKash Gateway Transactions",
      subtitle: "58% of total volume (৳1,05,820 BDT)",
      type: "financial",
      category: "Financials",
      path: "/dashboard?tab=revenue",
    },
    {
      id: "f3",
      title: "Pro Athlete Membership Plan",
      subtitle: "$39/mo or $468/yr - Most Popular",
      type: "financial",
      category: "Financials",
      path: "/#pricing",
    },
    {
      id: "f4",
      title: "VIP Ultimate Membership Plan",
      subtitle: "$79/mo or $948/yr - Full Access & Coaching",
      type: "financial",
      category: "Financials",
      path: "/#pricing",
    },
  ];

  const MOCK_TELEMETRY: SearchResultItem[] = [
    {
      id: "t1",
      title: "API & Socket Server Health",
      subtitle: "Status: Online • 99.98% System Uptime",
      type: "telemetry",
      category: "Telemetry",
      path: "/dashboard?tab=overview",
    },
    {
      id: "t2",
      title: "Live Athlete Check-ins & QR Scanner",
      subtitle: "842 Daily Scans across 64 Branches",
      type: "telemetry",
      category: "Telemetry",
      path: "/dashboard?tab=overview",
    },
    {
      id: "t3",
      title: "Real-time Branch Occupancy",
      subtitle: "Live member count & floor capacity metrics",
      type: "telemetry",
      category: "Telemetry",
      path: "/dashboard?tab=branches",
    },
    {
      id: "t4",
      title: "AI Fitness Assistant Telemetry",
      subtitle: "FITORA-AI Core v2.4 • Active Response Stream",
      type: "telemetry",
      category: "Telemetry",
      path: "/dashboard?tab=ai-coach",
    },
  ];

  const athletes = MOCK_ATHLETES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q)
  );

  const branches = MOCK_BRANCHES.filter(
    (b) =>
      b.title.toLowerCase().includes(q) || b.subtitle.toLowerCase().includes(q)
  );

  const financials = MOCK_FINANCIALS.filter(
    (f) =>
      f.title.toLowerCase().includes(q) || f.subtitle.toLowerCase().includes(q)
  );

  const telemetry = MOCK_TELEMETRY.filter(
    (t) =>
      t.title.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q)
  );

  return {
    query,
    totalCount: athletes.length + branches.length + financials.length + telemetry.length,
    athletes,
    branches,
    financials,
    telemetry,
  };
}
