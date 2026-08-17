import mongoose, { Schema, Document } from "mongoose";

export interface IMealPlan extends Document {
  userId?: mongoose.Types.ObjectId;
  title: string;
  caloriesTotal: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const MealPlanSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    caloriesTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    proteinGrams: {
      type: Number,
      required: true,
      default: 0,
    },
    carbsGrams: {
      type: Number,
      default: 0,
    },
    fatsGrams: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const MealPlan = mongoose.model<IMealPlan>("MealPlan", MealPlanSchema);
export default MealPlan;
