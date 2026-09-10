import mongoose, { Schema, Document } from "mongoose";

export interface IHeatmap extends Document {
  userId: string;
  date: string; // Normalized calendar date string "YYYY-MM-DD"
  dateObj: Date; // Normalized midnight Date object for indexing/sorting
  year: number; // Year number (e.g. 2026) for fast year-based queries
  activityCount: number; // Total activities/workouts logged on this day
  exercises: string[]; // Distinct exercise names logged on this day
  totalDuration: number; // Total workout duration in minutes on this day
  totalCalories: number; // Total calories burned on this day
  createdAt: Date;
  updatedAt: Date;
}

const HeatmapSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      default: "guest_user",
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    dateObj: {
      type: Date,
      required: true,
      default: Date.now,
    },
    year: {
      type: Number,
      required: true,
      index: true,
    },
    activityCount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    exercises: {
      type: [String],
      required: true,
      default: [],
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    totalCalories: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring user + calendar date = exactly one Heatmap document
HeatmapSchema.index({ userId: 1, date: 1 }, { unique: true });

// Compound index for fast queries by user and year
HeatmapSchema.index({ userId: 1, year: 1, date: 1 });

export const Heatmap = mongoose.model<IHeatmap>("Heatmap", HeatmapSchema);
export default Heatmap;
