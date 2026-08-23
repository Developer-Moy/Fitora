import mongoose, { Schema, Document } from "mongoose";

export interface IBMIHistory extends Document {
  userId?: string;
  height: number;
  weight: number;
  bmi: number;
  bmr: number;
  tdee: number;
  createdAt: Date;
  updatedAt: Date;
}

const bmiSchema = new Schema<IBMIHistory>(
  {
    userId: {
      type: String,
      required: false,
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
  },
  {
    timestamps: true,
  }
);

const BMI = mongoose.model<IBMIHistory>("BMI", bmiSchema);

export default BMI;