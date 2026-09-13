import { Router } from "express";
import {
  handleAiChat,
  getAiHistory,
  getAiQuotaStatus,
} from "../controllers/ai.controller";
import { checkAiQuota } from "../middlewares/aiQuota.middleware";

const router = Router();

/**
 * @route POST /api/ai/chat
 * @desc Handle AI Trainer prompts and return AI responses
 * @access Public / Protected with Daily Quota Check
 */
router.post("/chat", checkAiQuota, handleAiChat);

/**
 * @route GET /api/ai/quota
 * @desc Get today's remaining AI credit quota
 * @access Public / Protected
 */
router.get("/quota", getAiQuotaStatus);

/**
 * @route GET /api/ai/history
 * @desc Retrieve recent AI conversation history
 * @access Public (by sessionId) / Protected (by user token)
 */
router.get("/history", getAiHistory);

export default router;
