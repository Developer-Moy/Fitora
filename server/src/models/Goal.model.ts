import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  userId: mongoose.Types.ObjectId | string;
  targetWeightKg: number;
  weeklyWorkoutTarget: number;
  dailyCalorieTarget: number;
  dailyWaterTargetMl: number;
  startDate: Date;
  targetDate?: Date;
  status: "active" | "completed" | "paused";
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    targetWeightKg: { type: Number, required: true },
    weeklyWorkoutTarget: { type: Number, required: true, default: 4 },
    dailyCalorieTarget: { type: Number, required: true, default: 2400 },
    dailyWaterTargetMl: { type: Number, required: true, default: 3500 },
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date },
    status: { type: String, enum: ["active", "completed", "paused"], default: "active" },
  },
  { timestamps: true }
);

export const Goal = mongoose.model<IGoal>("Goal", goalSchema);
export default Goal;
