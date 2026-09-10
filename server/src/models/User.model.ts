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

export type PaymentMethod =
  | "bKash"
  | "Nagad"
  | "Card"
  | "Bank Transfer"
  | "None";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;

  // Basic Info
  name: string;
  email: string;
  passwordHash: string;
  phone: string;

  // Role & Membership
  role: UserRole;
  assignedBranch: string;
  assignedBranchSlug: string;
  plan: UserPlan;
  status: UserStatus;
  membershipExpiresAt?: Date;

  // User Stats
  attendanceStreakDays: number;
  hydrationTargetLiters: number;
  totalPaidBDT: number;
  paymentMethod: PaymentMethod;
  bmr?: number;
  tdee?: number;
  weight?: number;
  height?: number;
  gender?: string;
  bio?: string;
  avatarUrl?: string;
  image?: string;
  targetWeight?: number;
  fitnessGoal?: string;
  subscriptionExpiryDate?: Date;
  autoRenew?: boolean;
  cancelAtPeriodEnd?: boolean;

  // QR & Security
  qrCodeId: string;
  isMasterProtected: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    // Basic Info
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
      required: true,
      trim: true,
    },

    // Role & Membership
    role: {
      type: String,
      required: true,
      enum: [
        "master_admin",
        "branch_admin",
        "athlete",
        "user",
        "admin",
        "premium_user",
        "free_user",
      ],
    },
    assignedBranch: {
      type: String,
      required: true,
      trim: true,
      default: "Gulshan Premium Branch",
    },
    assignedBranchSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      default: "gulshan-branch",
    },
    plan: {
      type: String,
      required: true,
      enum: ["Free Pass", "Basic Pass", "Pro Athlete", "VIP Ultimate"],
      default: "Free Pass",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "suspended", "pending"],
      default: "active",
    },

    // User Stats
    bmr: {
      type: Number,
      default: null,
    },
    tdee: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    targetWeight: {
      type: Number,
      default: null,
    },
    fitnessGoal: {
      type: String,
      default: null,
    },
    attendanceStreakDays: {
      type: Number,
      required: true,
      default: 1,
    },
    hydrationTargetLiters: {
      type: Number,
      required: true,
      default: 3,
    },
    totalPaidBDT: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["bKash", "Nagad", "Card", "Bank Transfer", "None"],
      default: "None",
    },
    subscriptionExpiryDate: {
      type: Date,
      required: false,
    },
    autoRenew: {
      type: Boolean,
      default: true,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      required: false,
    },
    gender: {
      type: String,
      required: false,
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    avatarUrl: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },

    // QR & Security
    qrCodeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isMasterProtected: {
      type: Boolean,
      default: false,
    },
    membershipExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

// Enforce single Master Admin
userSchema.pre("save", function (next) {
  if (this.role === "master_admin") {
    const cleanEmail = (this.email || "").toLowerCase().trim();
    if (cleanEmail !== "master@fitora.com") {
      return next(
        new Error(
          "Only master@fitora.com can be Master Admin. Multiple master admins are strictly prohibited.",
        ),
      );
    }
  }
  next();
});

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ assignedBranchSlug: 1 });
userSchema.index({ status: 1 });

const User = mongoose.model<IUser>("User", userSchema);

export default User;
