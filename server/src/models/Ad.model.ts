import mongoose, { Schema, Document } from "mongoose";

export interface IAd extends Document {
  title?: string;
  imageUrl?: string;
  targetUrl?: string;
  clicks: number;
  clickCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const AdSchema: Schema = new Schema(
  {
    title: { type: String },
    imageUrl: { type: String },
    targetUrl: { type: String },
    clicks: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Ad = mongoose.models.Ad || mongoose.model<IAd>("Ad", AdSchema);
export default Ad;

