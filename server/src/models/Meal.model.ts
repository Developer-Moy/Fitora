import mongoose, { Document, Schema } from "mongoose";

export interface IMeal extends Document {
  id: string;
  name: string;
  ingredients: string[];
  calories: number;
  description: string;
  img: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MealSchema = new Schema<IMeal>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
      default: [],
    },
    calories: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Meal = mongoose.model<IMeal>("Meal", MealSchema);
export default Meal;
