import { Request, Response } from "express";
import BranchCheckin from "../models/BranchCheckin.model";
import Payment from "../models/Payment.model";

// Attendance Export
export const getAttendanceExport = async (
  req: Request,
  res: Response,
) => {
  try {
    const checkins = await BranchCheckin.find()
      .sort({ checkInTime: -1 })
      .lean();

    const data = checkins.map((item) => ({
      name: item.memberName,
      branch: item.branchName,
      date: item.date,
      time: new Date(item.checkInTime).toISOString().split("T")[1]?.slice(0, 8),
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch attendance export data",
    });
  }
};

// Revenue Export
export const getRevenueExport = async (
  req: Request,
  res: Response,
) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .lean();

    const data = payments.map((payment) => ({
      transactionId: payment.transactionId || "",
      plan: payment.planName || "",
      amount: payment.amountBDT || 0,
      date: payment.createdAt
        ? new Date(payment.createdAt).toISOString().split("T")[0]
        : "",
    }));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue export data",
    });
  }
};