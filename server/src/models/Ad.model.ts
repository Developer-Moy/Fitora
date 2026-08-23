import mongoose, { Document, Schema } from "mongoose";

export interface IAd extends Document {
  title: string;
  category: string;
  targetExercises: string[];
  productName: string;
  productUrl: string;
  imageUrl: string;
  price: number;
  discountPercentage?: number;
  clickCount: number;
  impressionCount: number;
}

const adSchema = new Schema<IAd>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    targetExercises: [{ type: String }],
    productName: { type: String, required: true, trim: true },
    productUrl: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    impressionCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Ad = mongoose.model<IAd>("Ad", adSchema);
export default Ad;
