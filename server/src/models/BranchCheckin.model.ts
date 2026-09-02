import mongoose, { Document, Schema } from "mongoose";

export type CheckinStatus = "checked_in" | "checked_out" | "cancelled";
export type CheckinSource = "qr" | "manual" | "staff_entry";

export interface IBranchCheckin extends Document {
    _id: mongoose.Types.ObjectId;
    branchId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    memberName: string;
    memberEmail: string;
    branchName: string;
    checkInTime: Date;
    checkOutTime?: Date | null;
    status: CheckinStatus;
    source: CheckinSource;
    durationMinutes: number;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}

const branchCheckinSchema = new Schema<IBranchCheckin>(
    {
        branchId: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
            index: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        memberName: {
            type: String,
            required: true,
            trim: true,
        },
        memberEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        branchName: {
            type: String,
            required: true,
            trim: true,
        },
        checkInTime: {
            type: Date,
            required: true,
            default: Date.now,
        },
        checkOutTime: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            enum: ["checked_in", "checked_out", "cancelled"],
            default: "checked_in",
            index: true,
        },
        source: {
            type: String,
            enum: ["qr", "manual", "staff_entry"],
            default: "qr",
        },
        durationMinutes: {
            type: Number,
            default: 0,
        },
        date: {
            type: String,
            required: true,
            trim: true,
            default: () => new Date().toISOString().slice(0, 10),
        },
    },
    {
        timestamps: true,
    },
);

branchCheckinSchema.index({ branchId: 1, userId: 1, date: 1, status: 1 });
branchCheckinSchema.index({ branchId: 1, status: 1, checkInTime: -1 });

const BranchCheckin = mongoose.model<IBranchCheckin>(
    "BranchCheckin",
    branchCheckinSchema,
);

export default BranchCheckin;
