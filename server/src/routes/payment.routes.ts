import { Router } from "express";
import {
  createCheckoutSession,
  verifySession,
  checkoutPayment,
  getMyTransactions,
  getAllPayments,
  getInvoiceById,
} from "../controllers/payment.controller.js";

const router = Router();

// Stripe Checkout & Verification
router.post("/create-checkout-session", createCheckoutSession);
router.get("/verify-session", verifySession);

// Direct bKash / Nagad / Card Checkout
router.post("/checkout", checkoutPayment);

// Transaction History
router.get("/me", getMyTransactions);
router.get("/my-transactions", getMyTransactions);
router.get("/all", getAllPayments);

// Digital Invoice by ID or Transaction ID
router.get("/invoice/:id", getInvoiceById);

export default router;
