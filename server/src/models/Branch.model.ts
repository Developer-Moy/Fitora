import mongoose, { Document, Schema } from "mongoose";

export interface IBranch extends Document {
    branchId: string;
    name: string;
    division: string;
    district: string;
    address: string;
    managerName?: string;
    managerEmail?: string;
    managerPhone?: string;
    maxCapacity: number;
    status: "active" | "maintenance" | "upcoming";
}

const branchSchema = new Schema<IBranch>(
    {
        branchId: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true, trim: true },
        division: { type: String, required: true, trim: true },
        district: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true },
        managerName: { type: String, trim: true, default: "" },
        managerEmail: { type: String, trim: true, lowercase: true, default: "" },
        managerPhone: { type: String, trim: true, default: "" },
        maxCapacity: { type: Number, default: 500, min: 1 },
        status: { type: String, enum: ["active", "maintenance", "upcoming"], default: "active" },
    },
    { timestamps: true },
);

export const Branch = mongoose.model<IBranch>("Branch", branchSchema);
export default Branch;