import mongoose, { Schema, Document } from "mongoose";

export interface IUserTier extends Document {
  userId: mongoose.Types.ObjectId;
  tier: "free" | "pro" | "vip";
  validUntil?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserTierSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tier: {
      type: String,
      enum: ["free", "pro", "vip"],
      default: "free",
      required: true,
    },
    validUntil: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserTier = mongoose.model<IUserTier>("UserTier", UserTierSchema);
export default UserTier;
