import { Request, Response } from "express";
import mongoose from "mongoose";
import Ad from "../models/Ad.model.js";

/**
 * Handles ad click tracking.
 * POST /api/ads/click
 */
export const trackAdClick = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const adId =
      req.body?.id ||
      req.body?.adId ||
      req.body?._id ||
      req.query?.id ||
      req.query?.adId;

    if (!adId || typeof adId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Ad ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(adId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Ad ID format",
      });
    }

    const ad = await Ad.findById(adId);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: "Advertisement not found",
      });
    }

    ad.clicks = (ad.clicks || 0) + 1;
    if (ad.clickCount !== undefined) {
      ad.clickCount = (ad.clickCount || 0) + 1;
    }

    await ad.save();

    return res.status(200).json({
      success: true,
      message: "Ad click tracked successfully",
      data: ad,
    });
  } catch (error: any) {
    console.error("Error in trackAdClick controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while tracking ad click",
      error: error.message || "Internal Server Error",
    });
  }
};

export default {
  trackAdClick,
};

