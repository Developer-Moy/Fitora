import mongoose, { Document, Schema } from "mongoose";

export type PaymentStatus = "pending" | "paid" | "failed";
export type BillingCycle = "monthly" | "annual";

export interface IPaymentTransaction extends Document {
  userId: mongoose.Types.ObjectId | string;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  stripeEventId?: string;
  planId: string;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: PaymentStatus;
  paidAt?: Date;
  subscriptionStartDate?: Date;
  subscriptionExpiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const paymentTransactionSchema = new Schema<IPaymentTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stripeCheckoutSessionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    stripePaymentIntentId: {
      type: String,
      trim: true,
    },
    stripeCustomerId: {
      type: String,
      trim: true,
    },
    stripeEventId: {
      type: String,
      trim: true,
      index: true,
    },
    planId: {
      type: String,
      required: true,
      trim: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "annual"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "usd",
      lowercase: true,
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "Card",
    },
    subscriptionStartDate: {
      type: Date,
    },

    subscriptionExpiryDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      required: true,
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const PaymentTransaction =
  mongoose.models.PaymentTransaction ||
  mongoose.model<IPaymentTransaction>(
    "PaymentTransaction",
    paymentTransactionSchema,
  );

export default PaymentTransaction;
