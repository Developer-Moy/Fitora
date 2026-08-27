import mongoose, { Document, Schema } from "mongoose";

export interface ICheckin extends Document {
    userId: string;
    branchId: string;
    checkedInAt: Date;
    checkedOutAt?: Date;
    durationMinutes?: number;
    status: "active" | "completed";
    method: "qr" | "manual" | "biometric";
}

const checkinSchema = new Schema<ICheckin>(
    {
        userId: { type: String, required: true, index: true },
        branchId: { type: String, required: true, index: true },
        checkedInAt: { type: Date, default: Date.now },
        checkedOutAt: Date,
        durationMinutes: { type: Number, min: 0 },
        status: { type: String, enum: ["active", "completed"], default: "active", index: true },
        method: { type: String, enum: ["qr", "manual", "biometric"], default: "manual" },
    },
    { timestamps: true },
);

checkinSchema.index({ branchId: 1, status: 1 });
export const Checkin = mongoose.model<ICheckin>("Checkin", checkinSchema);
export default Checkin;