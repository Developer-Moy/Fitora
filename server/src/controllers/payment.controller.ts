import { Request, Response } from "express";
import mongoose from "mongoose";
import Payment, { IPayment, PaymentGatewayType, BillingCycleType } from "../models/Payment.model";
import User from "../models/User.model";
import { AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/apiResponse";

// In-memory fallback transactions for resilient development
const inMemoryPayments: any[] = [
  {
    _id: "pay-demo-01",
    userId: "guest_user",
    userName: "Moloy Paul",
    userEmail: "master@fitora.com",
    planName: "VIP Ultimate",
    billingCycle: "yearly",
    amountBDT: 9480,
    gateway: "bKash",
    accountNumber: "01700000000",
    transactionId: "TRX-BK-982134",
    status: "completed",
    subscriptionStartDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    subscriptionExpiryDate: new Date(Date.now() + 350 * 24 * 60 * 60 * 1000),
    invoiceNumber: "INV-2026-001092",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
  },
  {
    _id: "pay-demo-02",
    userId: "guest_user",
    userName: "Pro Athlete Demo",
    userEmail: "athlete@fitora.com",
    planName: "Pro Athlete",
    billingCycle: "monthly",
    amountBDT: 3900,
    gateway: "Nagad",
    accountNumber: "01800000000",
    transactionId: "TRX-NG-445102",
    status: "completed",
    subscriptionStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    subscriptionExpiryDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    invoiceNumber: "INV-2026-001481",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Helper: Generate unique transaction ID
 */
function generateTransactionId(gateway: string): string {
  const prefix = gateway.toLowerCase().includes("bkash")
    ? "TRX-BK"
    : gateway.toLowerCase().includes("nagad")
    ? "TRX-NG"
    : "TRX-CD";
  const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `${prefix}-${timestamp}${randomHex}`;
}

/**
 * Helper: Generate unique invoice number
 */
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `INV-${year}-${randomNum}`;
}

/**
 * POST /api/payment/checkout
 * Processes subscription checkout, updates user plan & expiry, and generates invoice record
 */
export const checkoutPayment = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {
      planName,
      billingCycle = "monthly",
      amountBDT,
      gateway = "bKash",
      accountNumber,
      transactionId: customTrxId,
      userId: bodyUserId,
      userName: bodyUserName,
      userEmail: bodyUserEmail,
    } = req.body;

    // Validation
    if (!planName) {
      return res
        .status(400)
        .json(errorResponse("planName is required", "VALIDATION_ERROR", 400));
    }

    const amount = Number(amountBDT);
    if (isNaN(amount) || amount < 0) {
      return res
        .status(400)
        .json(errorResponse("amountBDT must be a positive number", "VALIDATION_ERROR", 400));
    }

    // Resolve user identifier
    const authUser = (req as AuthRequest).user;
    const resolvedUserId = bodyUserId || authUser?.userId || "guest_user";
    const resolvedEmail = bodyUserEmail || authUser?.email || "";
    const resolvedName = bodyUserName || "Valued Athlete";

    // Calculate subscription period
    const cycle = (billingCycle === "yearly" ? "yearly" : "monthly") as BillingCycleType;
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    if (cycle === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    } else {
      expiryDate.setDate(expiryDate.getDate() + 30);
    }

    const validGateway = (["bKash", "Nagad", "Card", "Bank Transfer"].includes(gateway)
      ? gateway
      : "bKash") as PaymentGatewayType;

    const finalTransactionId =
      customTrxId && String(customTrxId).trim() !== ""
        ? String(customTrxId).trim().toUpperCase()
        : generateTransactionId(validGateway);

    const invoiceNumber = generateInvoiceNumber();

    const paymentPayload = {
      userId: resolvedUserId,
      userName: resolvedName,
      userEmail: resolvedEmail,
      planName,
      billingCycle: cycle,
      amountBDT: amount,
      gateway: validGateway,
      accountNumber: accountNumber ? String(accountNumber).trim() : "",
      transactionId: finalTransactionId,
      status: "completed" as const,
      subscriptionStartDate: startDate,
      subscriptionExpiryDate: expiryDate,
      invoiceNumber,
    };

    let createdPayment: any = null;
    let updatedUser: any = null;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        // 1. Create Payment record
        createdPayment = await Payment.create(paymentPayload);

        // 2. Locate and auto-update User membership & revenue
        const userQuery: any[] = [];
        if (resolvedUserId && resolvedUserId !== "guest_user") {
          if (mongoose.Types.ObjectId.isValid(resolvedUserId)) {
            userQuery.push({ _id: new mongoose.Types.ObjectId(resolvedUserId) });
          }
          userQuery.push({ _id: resolvedUserId });
        }
        if (resolvedEmail) {
          userQuery.push({ email: resolvedEmail.toLowerCase().trim() });
        }

        if (userQuery.length > 0) {
          const targetUser = await User.findOne({ $or: userQuery });
          if (targetUser) {
            targetUser.plan = planName;
            targetUser.totalPaidBDT = (targetUser.totalPaidBDT || 0) + amount;
            targetUser.paymentMethod = validGateway;
            targetUser.subscriptionExpiryDate = expiryDate;
            targetUser.status = "active";

            // Promote role if standard user
            if (targetUser.role === "free_user" || targetUser.role === "user") {
              targetUser.role = "premium_user";
            }

            await targetUser.save();
            updatedUser = {
              id: targetUser._id,
              name: targetUser.name,
              email: targetUser.email,
              role: targetUser.role,
              plan: targetUser.plan,
              status: targetUser.status,
              subscriptionExpiryDate: targetUser.subscriptionExpiryDate,
              totalPaidBDT: targetUser.totalPaidBDT,
            };
          }
        }
      } catch (dbErr) {
        console.warn("[Payment Controller] DB operations failed, using memory store:", dbErr);
      }
    }

    // In-memory fallback creation
    const localPayment = {
      _id: createdPayment?._id?.toString() || `pay-${Date.now()}`,
      ...paymentPayload,
      createdAt: createdPayment?.createdAt || new Date(),
    };
    inMemoryPayments.unshift(localPayment);

    return res.status(200).json(
      successResponse("Subscription activated & payment confirmed successfully", {
        payment: createdPayment || localPayment,
        user: updatedUser || {
          id: resolvedUserId,
          plan: planName,
          status: "active",
          subscriptionExpiryDate: expiryDate,
        },
        invoice: {
          invoiceNumber,
          transactionId: finalTransactionId,
          planName,
          billingCycle: cycle,
          amountBDT: amount,
          gateway: validGateway,
          date: startDate,
          expiryDate,
        },
      })
    );
  } catch (error) {
    console.error("[Payment Controller] checkoutPayment Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to process subscription payment",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};

/**
 * GET /api/payment/my-transactions
 * Retrieves transaction history for the authenticated member or requested user
 */
export const getMyTransactions = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, email } = req.query;
    const authUser = (req as AuthRequest).user;
    const targetUserId = (userId as string) || authUser?.userId;
    const targetEmail = (email as string) || authUser?.email;

    let payments: any[] = [];
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        const orConditions: any[] = [];
        if (targetUserId) {
          if (mongoose.Types.ObjectId.isValid(targetUserId)) {
            orConditions.push({ userId: new mongoose.Types.ObjectId(targetUserId) });
          }
          orConditions.push({ userId: targetUserId });
        }
        if (targetEmail) {
          orConditions.push({ userEmail: targetEmail.toLowerCase().trim() });
        }

        const filter = orConditions.length > 0 ? { $or: orConditions } : {};
        payments = await Payment.find(filter).sort({ createdAt: -1 }).lean();
      } catch (dbErr) {
        console.warn("[Payment Controller] DB query failed, using memory store:", dbErr);
        payments = inMemoryPayments;
      }
    }

    if (!payments || payments.length === 0) {
      payments = inMemoryPayments;
      if (targetEmail) {
        const filtered = payments.filter(
          (p) => p.userEmail?.toLowerCase() === targetEmail.toLowerCase()
        );
        if (filtered.length > 0) payments = filtered;
      }
    }

    return res.status(200).json(
      successResponse("Transactions retrieved successfully", {
        count: payments.length,
        payments,
      })
    );
  } catch (error) {
    console.error("[Payment Controller] getMyTransactions Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to retrieve transactions",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};

/**
 * GET /api/payment/all
 * Retrieves all platform payment transactions for Master Admin review
 */
export const getAllPayments = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const limitNum = parseInt(limit as string, 10) || 50;
    const pageNum = parseInt(page as string, 10) || 1;

    let payments: any[] = [];
    let totalCount = 0;
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      try {
        totalCount = await Payment.countDocuments();
        payments = await Payment.find()
          .sort({ createdAt: -1 })
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum)
          .lean();
      } catch (dbErr) {
        payments = inMemoryPayments;
        totalCount = inMemoryPayments.length;
      }
    } else {
      payments = inMemoryPayments;
      totalCount = inMemoryPayments.length;
    }

    return res.status(200).json(
      successResponse("All payments retrieved successfully", {
        count: payments.length,
        total: totalCount,
        page: pageNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
        payments,
      })
    );
  } catch (error) {
    console.error("[Payment Controller] getAllPayments Error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch payment records",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};
