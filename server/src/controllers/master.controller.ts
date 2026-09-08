import { Response } from "express";
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