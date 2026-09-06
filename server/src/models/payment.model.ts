import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  planName: string;
  amountBDT: number;

  gateway: "bKash" | "Nagad" | "Card";

  transactionId: string;

  status: "pending" | "paid" | "failed" | "cancelled";

  billingCycle: "monthly" | "yearly";

  expiryDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planName: {
      type: String,
      required: true,
      trim: true,
    },

    amountBDT: {
      type: Number,
      required: true,
      min: 0,
    },

    gateway: {
      type: String,
      enum: ["bKash", "Nagad", "Card"],
      required: true,
    },

    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
    },

    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Payment =
  mongoose.models.Payment ||
  mongoose.model<IPayment>("Payment", paymentSchema);