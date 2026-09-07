import mongoose, { Document, Schema } from "mongoose";

export type PaymentGatewayType = "bKash" | "Nagad" | "Stripe" | "Card" | "Bank Transfer";
export type PaymentStatusType = "completed" | "pending" | "failed";
export type BillingCycleType = "monthly" | "yearly";

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  userName?: string;
  userEmail?: string;
  planName: string;
  billingCycle: BillingCycleType;
  amountBDT: number;
  gateway: PaymentGatewayType;
  accountNumber?: string;
  transactionId: string;
  status: PaymentStatusType;
  subscriptionStartDate: Date;
  subscriptionExpiryDate: Date;
  invoiceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.Mixed,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      trim: true,
      default: "Valued Athlete",
    },
    userEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    planName: {
      type: String,
      required: true,
      trim: true,
      enum: ["Free Pass", "Basic Pass", "Pro Athlete", "VIP Ultimate"],
    },
    billingCycle: {
      type: String,
      enum: ["monthly", "yearly"],
      default: "monthly",
    },
    amountBDT: {
      type: Number,
      required: true,
      min: 0,
    },
    gateway: {
      type: String,
      required: true,
      enum: ["bKash", "Nagad", "Stripe", "Card", "Bank Transfer"],
    },
    accountNumber: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["completed", "pending", "failed"],
      default: "completed",
      index: true,
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now,
    },
    subscriptionExpiryDate: {
      type: Date,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ createdAt: -1 });

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
export default Payment;
