import mongoose, { Document, Schema } from "mongoose";

export interface IAiQuota extends Document {
  identifier: string; // userId or ip_ADDRESS
  date: string; // YYYY-MM-DD
  planGenerations: number;
  chatQueries: number;
  tier: "free" | "paid" | "enterprise";
  createdAt: Date;
  updatedAt: Date;
}

const AiQuotaSchema = new Schema<IAiQuota>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    planGenerations: {
      type: Number,
      default: 0,
    },
    chatQueries: {
      type: Number,
      default: 0,
    },
    tier: {
      type: String,
      enum: ["free", "paid", "enterprise"],
      default: "free",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for instant O(1) daily lookup
AiQuotaSchema.index({ identifier: 1, date: 1 }, { unique: true });

export const AiQuota = mongoose.model<IAiQuota>("AiQuota", AiQuotaSchema);

