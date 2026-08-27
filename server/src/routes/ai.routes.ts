import { Router } from "express";
import { handleAiChat, getAiHistory } from "../controllers/ai.controller";

const router = Router();

/**
 * @route POST /api/ai/chat
 * @desc Handle AI Trainer prompts and return AI responses (Supports 'chat' and 'coach' modes)
 * @access Public / Protected
 */
router.post("/chat", handleAiChat);

/**
 * @route GET /api/ai/history
 * @desc Retrieve recent AI conversation history
 * @access Public (by sessionId) / Protected (by user token)
 */
router.get("/history", getAiHistory);

export default router;
