import mongoose, { Document, Schema } from "mongoose";

export interface IStopwatchSession extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  presetId?: string;
  workoutType?: string;
  durationMinutes: number;
  durationSeconds?: number;
  setsCount?: number;
  repsCount?: number;
  weightKg?: number;
  caloriesBurned?: number;
  notes?: string;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const stopwatchSessionSchema = new Schema<IStopwatchSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    presetId: {
      type: String,
      trim: true,
    },
    workoutType: {
      type: String,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 0,
    },
    durationSeconds: {
      type: Number,
      min: 0,
    },
    setsCount: {
      type: Number,
      min: 1,
      default: 1,
    },
    repsCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    weightKg: {
      type: Number,
      min: 0,
    },
    caloriesBurned: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    completedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for efficient querying of user sessions by completion date
stopwatchSessionSchema.index({ userId: 1, completedAt: -1 });

export const StopwatchSession = mongoose.model<IStopwatchSession>(
  "StopwatchSession",
  stopwatchSessionSchema,
);
export default StopwatchSession;
