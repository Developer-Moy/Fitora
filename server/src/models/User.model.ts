import mongoose, { Schema, Document } from "mongoose";

export type UserRole =
  | "master_admin"
  | "branch_admin"
  | "athlete"
  | "user"
  | "admin"
  | "premium_user"
  | "free_user";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  passwordHash?: string;
  phone?: string;
  role: UserRole;
  plan: string;
  assignedBranch?: string;
  status: "active" | "inactive" | "suspended" | "pending";
  attendanceStreakDays: number;
  hydrationTargetLiters: number;
  totalPaidBDT: number;
  isMasterProtected: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
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
    password: {
      type: String,
    },
    passwordHash: {
      type: String,
    },
    phone: {
      type: String,
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
      default: "athlete",
    },
    plan: {
      type: String,
      default: "Free Pass",
    },
    assignedBranch: {
      type: String,
      default: "Dhaka - Gulshan-2 Branch (Flagship)",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
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
    isMasterProtected: {
      type: Boolean,
      default: false,
    },
    avatarUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;