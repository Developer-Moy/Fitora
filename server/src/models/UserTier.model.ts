import mongoose, { Schema, Document } from "mongoose";

export interface IUserTier extends Document {
  userId: mongoose.Types.ObjectId;
  tier: "free" | "pro" | "vip";
  startDate: Date;
  expiryDate?: Date;
  validUntil?: Date; // Kept for backward compatibility
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserTierSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // Ensured only 1 tier record per user
      index: true,
    },
    tier: {
      type: String,
      enum: ["free", "pro", "vip"],
      default: "free",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    validUntil: {
      type: Date, // Alias/compatibility field for expiryDate
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to ensure validity sync between expiryDate and validUntil
UserTierSchema.pre("save", function (next) {
  if (this.expiryDate && !this.validUntil) {
    this.validUntil = this.expiryDate;
  } else if (this.validUntil && !this.expiryDate) {
    this.expiryDate = this.validUntil;
  }
  next();
});

export const UserTier = mongoose.model<IUserTier>("UserTier", UserTierSchema);
export default UserTier;