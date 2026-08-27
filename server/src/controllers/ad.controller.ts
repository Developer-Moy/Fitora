import { Request, Response } from "express";
import mongoose from "mongoose";
import { Ad } from "../models/Ad.model";
import { Newsletter } from "../models/Newsletter.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// Default Promotional Campaigns Fallback
const DEFAULT_FITORA_CAMPAIGNS = [
  {
    _id: "AD-01",
    title: "Bangla New Year 2026 Mega Fitness Pass",
    subtitle: "50% OFF on all 64 nationwide branches VIP Ultimate membership!",
    bannerType: "hero_promo",
    imageUrl: "/image1.jpg.jpeg",
    targetUrl: "/#pricing",
    discountCode: "BOISHAKHI50",
    badgeText: "LIMITED TIME 50% OFF",
    clicks: 1420,
    impressions: 8900,
    status: "active",
  },
  {
    _id: "AD-02",
    title: "1-on-1 Certified Personal Trainer Consultation",
    subtitle: "Book your free fitness assessment with our elite bodybuilding trainers.",
    bannerType: "dashboard_banner",
    imageUrl: "/image1.jpg.jpeg",
    targetUrl: "/#contact",
    discountCode: "FREETRIAL",
    badgeText: "FREE ASSESSMENT",
    clicks: 890,
    impressions: 4300,
    status: "active",
  },
];

/**
 * 1. Public: Get Active Promotional Ads (`GET /api/ads`)
 */
export const getPublicAds = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    const query: any = { status: "active" };
    if (type) {
      query.bannerType = type;
    }

    let ads = await Ad.find(query).sort({ createdAt: -1 });

    if (!ads || ads.length === 0) {
      ads = DEFAULT_FITORA_CAMPAIGNS as any;
    }

    return res.status(200).json({
      success: true,
      count: ads.length,
      data: ads,
    });
  } catch (error: any) {
    console.error("Error fetching public ads:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching advertisements.",
      error: error.message,
    });
  }
};

/**
 * 2. Protected: Create Promotional Ad Campaign (`POST /api/ads`)
 */
export const createAd = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      subtitle,
      bannerType,
      imageUrl,
      targetUrl,
      discountCode,
      badgeText,
      status,
      startDate,
      endDate,
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Title and Image URL are required fields.",
      });
    }

    const newAd = await Ad.create({
      title: title.trim(),
      subtitle: subtitle?.trim() || "",
      bannerType: bannerType || "dashboard_banner",
      imageUrl: imageUrl.trim(),
      targetUrl: targetUrl?.trim() || "/register",
      discountCode: discountCode?.trim() || "",
      badgeText: badgeText?.trim() || "SPECIAL OFFER",
      status: status || "active",
      startDate: startDate || new Date(),
      endDate: endDate || null,
      clicks: 0,
      impressions: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Promotional banner created successfully.",
      data: newAd,
    });
  } catch (error: any) {
    console.error("Error creating ad campaign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating advertisement.",
      error: error.message,
    });
  }
};

/**
 * 3. Protected: Update Promotional Ad Campaign (`PATCH /api/ads/:id`)
 */
export const updateAd = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await Ad.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Advertisement campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error updating ad campaign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating advertisement.",
      error: error.message,
    });
  }
};

/**
 * 4. Protected: Delete Promotional Ad Campaign (`DELETE /api/ads/:id`)
 */
export const deleteAd = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Ad.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Advertisement campaign not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Advertisement campaign deleted successfully.",
    });
  } catch (error: any) {
    console.error("Error deleting ad campaign:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while deleting advertisement.",
      error: error.message,
    });
  }
};

/**
 * 5. Public: Track Ad Click / CTR (`POST /api/ads/click`)
 */
export const trackAdClick = async (req: Request, res: Response) => {
  try {
    const adId = req.body?.id || req.body?.adId || req.body?._id;

    if (!adId) {
      return res.status(400).json({
        success: false,
        message: "Ad ID is required",
      });
    }

    if (mongoose.Types.ObjectId.isValid(adId)) {
      await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    }

    return res.status(200).json({
      success: true,
      message: "Ad click recorded successfully.",
    });
  } catch (error: any) {
    return res.status(200).json({
      success: true, // Do not break client navigation if analytics fails
      message: "Ad click registered.",
    });
  }
};

/**
 * 6. Public: Newsletter Subscription (`POST /api/newsletter/subscribe`)
 */
export const subscribeNewsletter = async (req: Request, res: Response) => {
  try {
    const { email, source } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if already subscribed
    let subscriber = await Newsletter.findOne({ email: cleanEmail });

    if (subscriber) {
      if (subscriber.status === "unsubscribed") {
        subscriber.status = "subscribed";
        await subscriber.save();
      }
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to the Fitora fitness newsletter!",
      });
    }

    subscriber = await Newsletter.create({
      email: cleanEmail,
      status: "subscribed",
      source: source || "footer",
    });

    return res.status(201).json({
      success: true,
      message: "Welcome to Fitora! You have successfully subscribed to our newsletter.",
      data: subscriber,
    });
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while subscribing to newsletter.",
      error: error.message,
    });
  }
};

/**
 * 7. Protected: Get All Newsletter Subscribers (`GET /api/newsletter/subscribers`)
 */
export const getNewsletterSubscribers = async (req: AuthRequest, res: Response) => {
  try {
    const subscribers = await Newsletter.find({ status: "subscribed" }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error while fetching newsletter subscribers.",
      error: error.message,
    });
  }
};

export default {
  getPublicAds,
  createAd,
  updateAd,
  deleteAd,
  trackAdClick,
  subscribeNewsletter,
  getNewsletterSubscribers,
};
