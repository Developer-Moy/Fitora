import { Router } from "express";
import { handleAiChat } from "../controllers/ai.controller";

const router = Router();

/**
 * @route POST /api/ai/chat
 * @desc Handle AI Trainer prompts and return AI responses
 * @access Public / Protected
 */
router.post("/chat", handleAiChat);

export default router;
