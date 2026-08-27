import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  userId: string;
  fitnessGoal?: string;
  targetWeight: number;
  strengthTarget?: string;
  weeklyWorkoutFrequency: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    fitnessGoal: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
    targetWeight: {
      type: Number,
      required: true,
    },
    weeklyWorkoutFrequency: {
      type: Number,
      required: true,
      default: 4,
    },
    strengthTarget: {
      type: String,
      trim: true,
      default: "",
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
export default Goal;
