import { Request, Response, NextFunction } from "express";
import { AiQuota } from "../models/AiQuota.model";
import { AuthRequest } from "./auth.middleware";
import { User } from "../models/User.model";
import { errorResponse } from "../utils/apiResponse";

export interface QuotaInfo {
  identifier: string;
  tier: "free" | "paid" | "enterprise";
  plansUsed: number;
  plansLimit: number;
  chatsUsed: number;
  chatsLimit: number;
  isPlanQuery: boolean;
}

export interface AiRequestWithQuota extends Request {
  aiQuota?: QuotaInfo;
}

export const checkAiQuota = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId || req.body.userId;
    const clientIp =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.ip ||
      "127.0.0.1";

    const identifier = userId ? `user_${userId}` : `ip_${clientIp}`;
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    // 1. Determine User Tier
    let tier: "free" | "paid" | "enterprise" = "free";

    if (userId) {
      const user = await User.findById(userId).select("plan role").lean();
      if (user) {
        if (
          user.role === "master_admin" ||
          user.role === "admin" ||
          user.plan === "VIP Ultimate"
        ) {
          tier = "enterprise";
        } else if (
          user.plan === "Basic Pass" ||
          user.plan === "Pro Athlete" ||
          user.role === "premium_user" ||
          user.role === "athlete"
        ) {
          tier = "paid";
        }
      }
    }

    // 2. Define Tier Limits
    const limits = {
      free: { plans: 2, chats: 10 },
      paid: { plans: 10, chats: 50 },
      enterprise: { plans: 100, chats: 500 },
    }[tier];

    // 3. Find or initialize today's quota record
    let record = await AiQuota.findOne({ identifier, date: today });
    if (!record) {
      record = await AiQuota.create({
        identifier,
        date: today,
        tier,
        planGenerations: 0,
        chatQueries: 0,
      });
    }

    // 4. Detect whether the prompt is asking for a comprehensive workout/diet plan
    const promptText = (
      req.body.promptText ||
      req.body.prompt ||
      req.body.text ||
      ""
    ).toLowerCase();

    const isPlanQuery =
      req.body.isPlan === true ||
      promptText.includes("plan") ||
      promptText.includes("routine") ||
      promptText.includes("split") ||
      promptText.includes("diet") ||
      promptText.includes("macro") ||
      promptText.includes("workout program") ||
      promptText.includes("blueprint");

    // 5. Check Limits
    if (isPlanQuery && record.planGenerations >= limits.plans) {
      return res.status(429).json(
        errorResponse(
          `Daily AI fitness plan limit reached (${record.planGenerations}/${limits.plans} used). Upgrade to FITORA Pro for 10 daily plans & personalized coaching!`,
          "QUOTA_EXCEEDED",
          429
        )
      );
    }

    if (record.chatQueries >= limits.chats) {
      return res.status(429).json(
        errorResponse(
          `Daily AI chat limit reached (${record.chatQueries}/${limits.chats} used). Upgrade to FITORA Pro for 50 daily coaching queries!`,
          "QUOTA_EXCEEDED",
          429
        )
      );
    }

    // Attach Quota info to request for controller to consume
    (req as AiRequestWithQuota).aiQuota = {
      identifier,
      tier,
      plansUsed: record.planGenerations,
      plansLimit: limits.plans,
      chatsUsed: record.chatQueries,
      chatsLimit: limits.chats,
      isPlanQuery,
    };

    next();
  } catch (error: any) {
    console.error("AI Quota Middleware Error (allowing through):", error);
    next();
  }
};

