import mongoose, { Document, Schema } from "mongoose";

export interface IExercise extends Document {
  name: string;
  description: string;

  primaryMuscles: string[];
  secondaryMuscles: string[];

  equipment: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";

  instructions: string[];
  commonMistakes: string[];

  videoUrl?: string;
  gifUrl?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    primaryMuscles: {
      type: [String],
      required: true,
    },

    secondaryMuscles: {
      type: [String],
      default: [],
    },

    equipment: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },

    instructions: {
      type: [String],
      required: true,
    },

    commonMistakes: {
      type: [String],
      default: [],
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    gifUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Exercise = mongoose.model<IExercise>(
  "Exercise",
  ExerciseSchema
);