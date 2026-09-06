import { Router } from "express";
import {
  createCheckoutSession,
  verifySession,
} from "../controllers/payment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", createCheckoutSession);

// GET /api/payments/verify-session?session_id=...
router.get("/verify-session", verifySession);

export default router;
