import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  userId: string;
  targetWeight: number;
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
    targetWeight: {
      type: Number,
      required: true,
    },
    weeklyWorkoutFrequency: {
      type: Number,
      required: true,
      default: 4,
    },
  },
  {
    timestamps: true,
  }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
export default Goal;
