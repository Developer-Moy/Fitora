import mongoose, { Document, Schema } from "mongoose";

export interface IGoal extends Document {
  userId: string;

  goalType:
    | "Bulking"
    | "Cutting"
    | "Recomp"
    | "Maintenance";

  targetWeight: number;
  weeklyWorkoutFrequency: number;

  bmr: number;
  tdee: number;
  targetCalories: number;

  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };

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

    goalType: {
      type: String,
      enum: [
        "Bulking",
        "Cutting",
        "Recomp",
        "Maintenance",
      ],
      required: true,
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

    bmr: {
      type: Number,
      required: true,
    },

    tdee: {
      type: Number,
      required: true,
    },

    targetCalories: {
      type: Number,
      required: true,
    },

    macros: {
      protein: {
        type: Number,
        required: true,
      },

      carbs: {
        type: Number,
        required: true,
      },

      fat: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Goal =
  mongoose.models.Goal ||
  mongoose.model<IGoal>("Goal", goalSchema);

export default Goal;