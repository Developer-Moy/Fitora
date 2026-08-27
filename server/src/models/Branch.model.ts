import mongoose, { Schema } from "mongoose";

export type BangladeshDivision =
  | "Dhaka"
  | "Chittagong"
  | "Sylhet"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"
  | "Rangpur"
  | "Mymensingh";

export interface IBranch {
  _id: string;
  name: string;
  division: BangladeshDivision;
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
  status: "active" | "maintenance" | "closed";
  createdAt?: Date;
  updatedAt?: Date;
}

const branchSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    division: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chittagong",
        "Sylhet",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Rangpur",
        "Mymensingh",
      ],
    },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    adminName: { type: String, default: "Branch Admin" },
    adminEmail: { type: String, required: true, lowercase: true },
    adminPhone: { type: String, default: "+880 1700-000000" },
    totalMembers: { type: Number, default: 0 },
    maxCapacity: { type: Number, default: 400 },
    monthlyRevenueBDT: { type: Number, default: 0 },
    activeNow: { type: Number, default: 0 },
    equipmentCount: { type: Number, default: 50 },
    trainersCount: { type: Number, default: 5 },
    status: {
      type: String,
      enum: ["active", "maintenance", "closed"],
      default: "active",
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

branchSchema.index({ division: 1 });
branchSchema.index({ district: 1 });

export const Branch =
  mongoose.models.Branch || mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;
