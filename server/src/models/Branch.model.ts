import mongoose, { Document, Schema } from "mongoose";

export type BranchDivision =
  | "Dhaka"
  | "Chittagong"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"
  | "Sylhet"
  | "Rangpur"
  | "Mymensingh";

export type BranchStatus = "active" | "maintenance" | "upcoming";

export interface IBranch extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  division: BranchDivision;
  district: string;
  address: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  totalMembers: number;
  maxCapacity: number;
  monthlyRevenueBDT: number;
  activeNow: number;
  equipmentCount: number;
  trainersCount: number;
  status: BranchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    division: {
      type: String,
      enum: [
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
      ],
      required: true,
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    adminName: {
      type: String,
      default: "Branch Operations Manager",
      trim: true,
    },
    adminEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    adminPhone: {
      type: String,
      default: "+8801700000000",
      trim: true,
    },
    totalMembers: {
      type: Number,
      default: 250,
    },
    maxCapacity: {
      type: Number,
      default: 400,
    },
    monthlyRevenueBDT: {
      type: Number,
      default: 350000,
    },
    activeNow: {
      type: Number,
      default: 45,
    },
    equipmentCount: {
      type: Number,
      default: 65,
    },
    trainersCount: {
      type: Number,
      default: 8,
    },
    status: {
      type: String,
      enum: ["active", "maintenance", "upcoming"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

branchSchema.index({ division: 1 });
branchSchema.index({ district: 1 });
branchSchema.index({ status: 1 });

export const Branch = mongoose.model<IBranch>("Branch", branchSchema);
export default Branch;
