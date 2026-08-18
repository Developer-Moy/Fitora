import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutLog extends Document {
  userId?: mongoose.Types.ObjectId | string;
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  weight?: number;
  durationMinutes?: number;
  caloriesBurned?: number;
  notes?: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkoutLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.Mixed,
      ref: "User",
      required: false,
      default: "guest_user",
      index: true,
    },
    exerciseName: {
      type: String,
      required: true,
      trim: true,
    },
    setsCount: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    repsCount: {
      type: Number,
      required: true,
      default: 10,
      min: 1,
    },
    weight: {
      type: Number,
      required: false,
      default: 0,
    },
    durationMinutes: {
      type: Number,
      required: false,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      required: false,
      default: 0,
    },
    notes: {
      type: String,
      required: false,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkoutLog = mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
export default WorkoutLog;
