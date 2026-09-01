import mongoose, { Document, Schema } from "mongoose";

export interface IBMIHistory extends Document {
  userId: mongoose.Types.ObjectId;

  age: number;
  gender: "male" | "female";
  height: number;
  weight: number;

  bmi: number;
  bmr: number;
  tdee: number;
  targetCalories: number;

  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };

  bmiCategory: string;
  riskLevel: string;

  idealWeightRange: {
    min: number;
    max: number;
  };

  createdAt: Date;
  updatedAt: Date;
}

const bmiHistorySchema = new Schema<IBMIHistory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    age: {
      type: Number,
      required: true,
      min: 1,
    },

    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },

    height: {
      type: Number,
      required: true,
      min: 50,
      max: 250,
    },

    weight: {
      type: Number,
      required: true,
      min: 20,
      max: 300,
    },

    bmi: {
      type: Number,
      required: true,
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

    bmiCategory: {
      type: String,
      required: true,
    },

    riskLevel: {
      type: String,
      required: true,
    },

    idealWeightRange: {
      min: {
        type: Number,
        required: true,
      },

      max: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const BMIHistory =
  mongoose.models.BMIHistory ||
  mongoose.model<IBMIHistory>(
    "BMIHistory",
    bmiHistorySchema
  );

export default BMIHistory;