import mongoose, { Document, Schema } from "mongoose";

export type PresetType = "HIIT" | "Boxing" | "Rest" | "Custom";

export interface IStopwatchPreset extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  workDuration: number;
  restDuration: number;
  warmupDuration: number;
  cooldownDuration: number;
  rounds: number;
  type?: PresetType;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const stopwatchPresetSchema = new Schema<IStopwatchPreset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    workDuration: {
      type: Number,
      required: true,
      min: 0,
    },
    restDuration: {
      type: Number,
      required: true,
      min: 0,
    },
    warmupDuration: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    cooldownDuration: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rounds: {
      type: Number,
      required: true,
      min: 1,
    },
    type: {
      type: String,
      enum: ["HIIT", "Boxing", "Rest", "Custom"],
      default: "Custom",
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user preset queries
stopwatchPresetSchema.index({ userId: 1, createdAt: -1 });

export const StopwatchPreset = mongoose.model<IStopwatchPreset>(
  "StopwatchPreset",
  stopwatchPresetSchema
);
export default StopwatchPreset;
