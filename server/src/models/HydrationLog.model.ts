import mongoose, { Document, Schema } from "mongoose";

export interface IHydrationLog extends Document {
    userId: string;
    date: string;
    liters: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const hydrationLogSchema = new Schema<IHydrationLog>(
    {
        userId: { type: String, required: true, index: true },
        date: { type: String, required: true },
        liters: { type: Number, required: true, min: 0, default: 0 },
    },
    { timestamps: true },
);

hydrationLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export const HydrationLog = mongoose.model<IHydrationLog>("HydrationLog", hydrationLogSchema);
export default HydrationLog;