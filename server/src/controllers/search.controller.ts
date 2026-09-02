import { Request, Response } from "express";
import User from "../models/User.model";
import Branch from "../models/Branch.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

// Static definitions for Financials & Telemetry entities to search against
const FINANCIAL_ENTITIES = [
  {
    id: "fin-revenue",
    title: "Total Platform Revenue",
    subtitle: "$182,450 YTD Revenue Overview",
    type: "financial",
    category: "Financials",
    path: "/dashboard?tab=revenue",
    tags: ["revenue", "income", "money", "earnings", "financial", "growth"],
  },
  {
    id: "fin-bkash",
    title: "bKash Gateway Transactions",
    subtitle: "58% of total volume (৳1,05,820 BDT)",
    type: "financial",
    category: "Financials",
    path: "/dashboard?tab=revenue",
    tags: ["bkash", "mobile wallet", "payment", "gateway", "bdt"],
  },
  {
    id: "fin-nagad",
    title: "Nagad Gateway Transactions",
    subtitle: "28% of total volume (৳51,080 BDT)",
    type: "financial",
    category: "Financials",
    path: "/dashboard?tab=revenue",
    tags: ["nagad", "mobile wallet", "payment", "gateway", "instant"],
  },
  {
    id: "fin-card",
    title: "Credit/Debit Card Settlement",
    subtitle: "14% of total volume (Visa & MasterCard)",
    type: "financial",
    category: "Financials",
    path: "/dashboard?tab=revenue",
    tags: ["card", "visa", "mastercard", "stripe", "credit", "debit"],
  },
  {
    id: "fin-plan-pro",
    title: "Pro Athlete Membership Plan",
    subtitle: "$39/mo or $468/yr - Most Popular Plan",
    type: "financial",
    category: "Financials",
    path: "/#pricing",
    tags: ["pro athlete", "plan", "membership", "package", "subscription"],
  },
  {
    id: "fin-plan-vip",
    title: "VIP Ultimate Membership Plan",
    subtitle: "$79/mo or $948/yr - Full Access & Personal Coaching",
    type: "financial",
    category: "Financials",
    path: "/#pricing",
    tags: ["vip ultimate", "vip", "plan", "membership", "package", "coaching"],
  },
  {
    id: "fin-plan-basic",
    title: "Basic Pass Membership Plan",
    subtitle: "$19/mo or $228/yr - Standard Gym Floor Access",
    type: "financial",
    category: "Financials",
    path: "/#pricing",
    tags: ["basic pass", "basic", "plan", "membership", "starter"],
  },
];

const TELEMETRY_ENTITIES = [
  {
    id: "tel-server-health",
    title: "API & Socket Server Health",
    subtitle: "Status: Online • 99.98% System Uptime",
    type: "telemetry",
    category: "Telemetry",
    path: "/dashboard?tab=overview",
    tags: ["server", "health", "uptime", "telemetry", "status", "system"],
  },
  {
    id: "tel-live-checkins",
    title: "Live Athlete Check-ins & QR Scanner",
    subtitle: "842 Daily Scans across 64 Branches",
    type: "telemetry",
    category: "Telemetry",
    path: "/dashboard?tab=overview",
    tags: ["checkin", "qr", "scanner", "attendance", "live", "telemetry"],
  },
  {
    id: "tel-branch-occupancy",
    title: "Real-time Branch Occupancy Telemetry",
    subtitle: "Live member count & floor capacity metrics",
    type: "telemetry",
    category: "Telemetry",
    path: "/dashboard?tab=branches",
    tags: ["occupancy", "capacity", "branches", "crowd", "realtime"],
  },
  {
    id: "tel-ai-engine",
    title: "AI Fitness Assistant Telemetry",
    subtitle: "FITORA-AI Core v2.4 • Active Response Stream",
    type: "telemetry",
    category: "Telemetry",
    path: "/dashboard?tab=ai-coach",
    tags: ["ai", "assistant", "coach", "bot", "gemini", "model"],
  },
  {
    id: "tel-stopwatch-presets",
    title: "Gym Rest Stopwatch & Intervals",
    subtitle: "HIIT, Tabata & Rest Timer telemetry",
    type: "telemetry",
    category: "Telemetry",
    path: "/stopwatch",
    tags: ["stopwatch", "timer", "hiit", "tabata", "rest", "intervals"],
  },
];

/**
 * Controller: Global Multi-Entity Search API
 * Endpoint: GET /api/search?q=...
 */
export const globalSearch = async (req: Request, res: Response) => {
  try {
    const rawQuery = (req.query.q as string) || "";
    const query = rawQuery.trim();

    if (!query || query.length < 1) {
      return res.status(200).json(
        successResponse("Empty search query", {
          query: "",
          totalCount: 0,
          athletes: [],
          branches: [],
          financials: [],
          telemetry: [],
        })
      );
    }

    const regex = new RegExp(query, "i");

    // 1. Search MongoDB for Athletes / Users
    let athletes: any[] = [];
    try {
      athletes = await User.find(
        {
          $or: [
            { name: regex },
            { email: regex },
            { phone: regex },
            { assignedBranch: regex },
            { role: regex },
            { plan: regex },
          ],
        },
        "name email phone role plan assignedBranch status qrCodeId"
      )
        .limit(6)
        .lean();
    } catch (err) {
      athletes = [];
    }

    // Format Athletes results
    const formattedAthletes = athletes.map((user) => ({
      id: user._id?.toString() || user.qrCodeId,
      title: user.name,
      subtitle: `${user.email} • ${user.assignedBranch || "Unassigned"} (${user.plan || "Free"})`,
      badge: user.role,
      type: "athlete",
      category: "Athletes",
      path: `/dashboard?tab=athletes&user=${encodeURIComponent(user.name)}`,
      details: {
        role: user.role,
        phone: user.phone,
        status: user.status,
      },
    }));

    // 2. Search MongoDB for Branches
    let branches: any[] = [];
    try {
      branches = await Branch.find(
        {
          $or: [
            { name: regex },
            { division: regex },
            { district: regex },
            { city: regex },
            { address: regex },
            { adminName: regex },
          ],
        },
        "name division district city address adminName status memberCapacity"
      )
        .limit(6)
        .lean();
    } catch (err) {
      branches = [];
    }

    // Format Branches results
    const formattedBranches = branches.map((branch) => ({
      id: branch._id?.toString(),
      title: branch.name,
      subtitle: `${branch.district}, ${branch.division} • Mgr: ${branch.adminName || "N/A"}`,
      badge: branch.status,
      type: "branch",
      category: "Branches",
      path: `/dashboard?tab=branches&branch=${encodeURIComponent(branch.name)}`,
      details: {
        division: branch.division,
        capacity: branch.memberCapacity,
      },
    }));

    // 3. Search Financials
    const queryLower = query.toLowerCase();
    const formattedFinancials = FINANCIAL_ENTITIES.filter(
      (item) =>
        item.title.toLowerCase().includes(queryLower) ||
        item.subtitle.toLowerCase().includes(queryLower) ||
        item.tags.some((tag) => tag.includes(queryLower))
    ).slice(0, 5);

    // 4. Search Telemetry
    const formattedTelemetry = TELEMETRY_ENTITIES.filter(
      (item) =>
        item.title.toLowerCase().includes(queryLower) ||
        item.subtitle.toLowerCase().includes(queryLower) ||
        item.tags.some((tag) => tag.includes(queryLower))
    ).slice(0, 5);

    const totalCount =
      formattedAthletes.length +
      formattedBranches.length +
      formattedFinancials.length +
      formattedTelemetry.length;

    return res.status(200).json(
      successResponse("Search results retrieved successfully", {
        query,
        totalCount,
        athletes: formattedAthletes,
        branches: formattedBranches,
        financials: formattedFinancials,
        telemetry: formattedTelemetry,
      })
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to execute global search",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
