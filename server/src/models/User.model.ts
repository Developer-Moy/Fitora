import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "master_admin" | "branch_admin" | "athlete" | "trainer";
  assignedBranch?: string;
  plan: "Basic Pass" | "Pro Athlete" | "VIP Ultimate" | "Free Pass";
  status: "active" | "suspended" | "pending";
  totalPaidBDT: number;
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
    role: {
      type: String,
      enum: ["user", "admin", "master_admin", "branch_admin", "athlete", "trainer"],
      default: "user",
    },
    assignedBranch: { type: String, default: "" },
    plan: { type: String, enum: ["Basic Pass", "Pro Athlete", "VIP Ultimate", "Free Pass"], default: "Free Pass" },
    status: { type: String, enum: ["active", "suspended", "pending"], default: "active" },
    totalPaidBDT: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
export default User;