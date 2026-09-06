import mongoose, { Document, Schema } from "mongoose";

export interface IExercise extends Document {
  id: number;

  name: string;
  category: string;
  difficulty: string;

  duration: string;
  equipment: string;
  muscle: string;

  description: string;

  tips: string[];

  videoId: string;
  image: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    difficulty: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      required: true,
    },

    duration: {
      type: String,
      required: true,
      trim: true,
    },

    equipment: {
      type: String,
      required: true,
      trim: true,
    },

    muscle: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    tips: {
      type: [String],
      required: true,
      default: [],
    },

    videoId: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
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