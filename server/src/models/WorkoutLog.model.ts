import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutLog extends Document {
  userId: mongoose.Types.ObjectId;
  exerciseName: string;
  setsCount: number;
  repsCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const WorkoutLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    },
    repsCount: {
      type: Number,
      required: true,
      default: 10,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkoutLog = mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
export default WorkoutLog;
