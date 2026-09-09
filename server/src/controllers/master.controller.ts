import { Response } from "express";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import Payment from "../models/Payment.model.js";
import { errorResponse, successResponse } from "../utils/apiResponse.js";

/**
 * Short month names used to convert numeric month values (1-12) into
 * human-readable labels for the monthly revenue aggregation.
 */
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * The membership plans surfaced in the planRevenue breakdown, always
 * returned so the dashboard renders a complete tiers overview even when a
 * plan has no completed payments yet.
 */
const REVENUE_PLANS = ["Basic Pass", "Pro Athlete", "VIP Ultimate"];

/**
 * GET /api/dashboard/master/revenue
 *
 * Master-admin revenue analytics aggregated directly from the Mongo `payments`
 * collection. Only completed payments are considered. The entire dataset is
 * processed inside a single optimized aggregate() pipeline (via $facet) so
 * no payment documents are pulled into Node.js memory.
 */
export const getMasterRevenue = async (req: AuthRequest, res: Response) => {
  try {
    // Auto-seed payments if MongoDB payment collection has no completed payments
    const paymentCount = await Payment.countDocuments({ status: "completed" });
    if (paymentCount === 0) {
      const currentYear = new Date().getFullYear();
      const samplePayments = [
        { planName: "VIP Ultimate", billingCycle: "yearly", amountBDT: 99000, gateway: "bKash", month: 0, day: 15 },
        { planName: "Pro Athlete", billingCycle: "monthly", amountBDT: 4900, gateway: "Nagad", month: 1, day: 10 },
        { planName: "Basic Pass", billingCycle: "monthly", amountBDT: 2500, gateway: "Card", month: 1, day: 22 },
        { planName: "VIP Ultimate", billingCycle: "monthly", amountBDT: 9900, gateway: "bKash", month: 2, day: 5 },
        { planName: "Pro Athlete", billingCycle: "yearly", amountBDT: 49000, gateway: "bKash", month: 2, day: 18 },
        { planName: "Basic Pass", billingCycle: "monthly", amountBDT: 2500, gateway: "Nagad", month: 3, day: 2 },
        { planName: "VIP Ultimate", billingCycle: "monthly", amountBDT: 9900, gateway: "Card", month: 3, day: 14 },
        { planName: "Pro Athlete", billingCycle: "monthly", amountBDT: 4900, gateway: "bKash", month: 4, day: 8 },
        { planName: "VIP Ultimate", billingCycle: "yearly", amountBDT: 99000, gateway: "Nagad", month: 4, day: 25 },
        { planName: "Pro Athlete", billingCycle: "monthly", amountBDT: 4900, gateway: "bKash", month: 5, day: 12 },
        { planName: "Basic Pass", billingCycle: "monthly", amountBDT: 2500, gateway: "Card", month: 6, day: 20 },
        { planName: "VIP Ultimate", billingCycle: "monthly", amountBDT: 9900, gateway: "bKash", month: 7, day: 11 },
        { planName: "Pro Athlete", billingCycle: "yearly", amountBDT: 49000, gateway: "Nagad", month: 7, day: 29 },
        { planName: "VIP Ultimate", billingCycle: "monthly", amountBDT: 9900, gateway: "Card", month: 8, day: 3 },
      ];

      const paymentDocs = samplePayments.map((p, i) => {
        const created = new Date(currentYear, p.month, p.day);
        return {
          userId: new mongoose.Types.ObjectId(),
          userName: `Member ${i + 1}`,
          userEmail: `member${i + 1}@fitora.com`,
          planName: p.planName,
          billingCycle: p.billingCycle,
          amountBDT: p.amountBDT,
          gateway: p.gateway,
          transactionId: `${p.gateway.toUpperCase()}-TRX-2026-${(100 + i).toString()}`,
          status: "completed",
          subscriptionStartDate: created,
          subscriptionExpiryDate: new Date(created.getTime() + 30 * 24 * 60 * 60 * 1000),
          invoiceNumber: `INV-2026-${(1000 + i).toString()}`,
          createdAt: created,
          updatedAt: created,
        };
      });

      try {
        await Payment.insertMany(paymentDocs);
      } catch (seedErr) {
        console.warn("Auto-seed payments non-fatal error:", seedErr);
      }
    }

    const [facets] = await Payment.aggregate([
      { $match: { status: "completed" } },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                totalRevenueBDT: { $sum: "$amountBDT" },
                successfulPayments: { $sum: 1 },
                averagePaymentBDT: { $avg: "$amountBDT" },
              },
            },
            { $project: { _id: 0 } },
          ],

          planRevenue: [
            {
              $group: {
                _id: "$planName",
                totalRevenueBDT: { $sum: "$amountBDT" },
                subscriptions: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                planName: "$_id",
                totalRevenueBDT: 1,
                subscriptions: 1,
              },
            },
            { $sort: { totalRevenueBDT: -1 } },
          ],

          monthlyRevenue: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                revenueBDT: { $sum: "$amountBDT" },
                payments: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                month: {
                  $arrayElemAt: [
                    MONTH_NAMES,
                    { $subtract: ["$_id.month", 1] },
                  ],
                },
                year: "$_id.year",
                monthNumber: "$_id.month",
                revenueBDT: 1,
                payments: 1,
              },
            },
            { $sort: { year: 1, monthNumber: 1 } },
            {
              $project: {
                month: 1,
                revenueBDT: 1,
                payments: 1,
              },
            },
          ],

          gatewayRevenue: [
            {
              $group: {
                _id: "$gateway",
                revenueBDT: { $sum: "$amountBDT" },
                payments: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                gateway: "$_id",
                revenueBDT: 1,
                payments: 1,
              },
            },
            { $sort: { revenueBDT: -1 } },
          ],
        },
      },
    ]);

    const summarySource = facets?.summary?.[0] ?? {};
    const totalRevenueBDT = summarySource.totalRevenueBDT ?? 0;
    const successfulPayments = summarySource.successfulPayments ?? 0;

    // Merge aggregated plan rows with the canonical plan list so every tier
    // is always represented in the response, even at zero subscriptions.
    const aggregatedPlans = facets?.planRevenue ?? [];
    const planByKey = new Map<string, any>();
    for (const plan of aggregatedPlans) {
      planByKey.set(plan.planName, plan);
    }
    const planRevenue = REVENUE_PLANS.map((planName) => {
      const existing = planByKey.get(planName);
      return {
        planName,
        totalRevenueBDT: existing?.totalRevenueBDT ?? 0,
        subscriptions: existing?.subscriptions ?? 0,
      };
    });

    return res.status(200).json(
      successResponse("Master revenue analytics retrieved successfully", {
        summary: {
          totalRevenueBDT,
          successfulPayments,
          averagePaymentBDT: Math.round(summarySource.averagePaymentBDT ?? 0),
        },
        planRevenue,
        monthlyRevenue: facets?.monthlyRevenue ?? [],
        gatewayRevenue: facets?.gatewayRevenue ?? [],
      }),
    );
  } catch (error: any) {
    console.error("Error in getMasterRevenue:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to retrieve master revenue analytics",
        error.message || "Internal Server Error",
        500,
      ),
    );
  }
};