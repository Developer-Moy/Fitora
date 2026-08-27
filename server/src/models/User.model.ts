import mongoose, { Document, Schema } from "mongoose";

export type UserRole =
  | "master_admin"
  | "branch_admin"
  | "athlete"
  | "user"
  | "admin"
  | "premium_user"
  | "free_user";

export type UserPlan =
  | "Free Pass"
  | "Basic Pass"
  | "Pro Athlete"
  | "VIP Ultimate";

export type UserStatus = "active" | "suspended" | "pending";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  assignedBranch?: string;
  plan: UserPlan;
  status: UserStatus;
  attendanceStreakDays: number;
  hydrationTargetLiters: number;
  totalPaidBDT: number;
  paymentMethod: "bKash" | "Nagad" | "Card" | "None";
  qrCodeId?: string;
  isMasterProtected?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    role: {
      type: String,
      enum: [
        "master_admin",
        "branch_admin",
        "athlete",
        "user",
        "admin",
        "premium_user",
        "free_user",
      ],
      default: "user",
    },
    assignedBranch: {
      type: String,
      default: "Dhanmondi, Dhaka",
    },
    plan: {
      type: String,
      enum: ["Free Pass", "Basic Pass", "Pro Athlete", "VIP Ultimate"],
      default: "Free Pass",
    },
    status: {
      type: String,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },
    attendanceStreakDays: {
      type: Number,
      default: 0,
    },
    hydrationTargetLiters: {
      type: Number,
      default: 3.5,
    },
    totalPaidBDT: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["bKash", "Nagad", "Card", "None"],
      default: "None",
    },
    qrCodeId: {
      type: String,
      default: () =>
        `FIT-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    },
    isMasterProtected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model<IUser>("User", userSchema);
export default User;
