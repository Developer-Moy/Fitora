import { Router } from "express";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = Router();

// POST /api/payments/create-checkout-session
router.post("/create-checkout-session", createCheckoutSession);

export default router;
