import mongoose, { Schema, Document } from "mongoose";

export interface IMealCatalog extends Document {
  name: string;
  description: string;
  imageUrl: string;
  goal: string;
  calories: number;
  prepTime: number;
  dietaryTags: string[];
  ingredients: string[];
  instructions: string[];
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  servings?: number;
  difficulty?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const MealCatalogSchema: Schema = new Schema(
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
    imageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    goal: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    prepTime: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },
    dietaryTags: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
    ingredients: {
      type: [String],
      required: true,
      default: [],
    },
    instructions: {
      type: [String],
      required: true,
      default: [],
    },
    macros: {
      protein: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      carbs: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      fats: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
    },
    servings: {
      type: Number,
      required: false,
      default: 1,
      min: 1,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MealCatalog = mongoose.model<IMealCatalog>("MealCatalog", MealCatalogSchema);
export default MealCatalog;