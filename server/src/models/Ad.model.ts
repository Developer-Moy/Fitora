import mongoose, { Schema, Document } from "mongoose";

export type AdBannerType =
  | "hero_promo"
  | "dashboard_banner"
  | "sidebar_sponsor"
  | "popup_deal";

export type AdStatus = "active" | "scheduled" | "paused" | "expired";

export interface IAd extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  subtitle?: string;
  bannerType: AdBannerType;
  imageUrl: string;
  targetUrl: string;
  discountCode?: string;
  badgeText?: string;
  clicks: number;
  impressions: number;
  status: AdStatus;
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    bannerType: {
      type: String,
      enum: ["hero_promo", "dashboard_banner", "sidebar_sponsor", "popup_deal"],
      default: "dashboard_banner",
    },
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    targetUrl: {
      type: String,
      required: true,
      trim: true,
      default: "/register",
    },
    discountCode: {
      type: String,
      trim: true,
      default: "",
    },
    badgeText: {
      type: String,
      trim: true,
      default: "LIMITED PROMO",
    },
    clicks: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "scheduled", "paused", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

AdSchema.index({ status: 1 });
AdSchema.index({ bannerType: 1 });

export const Ad = mongoose.models.Ad || mongoose.model<IAd>("Ad", AdSchema);
export default Ad;
