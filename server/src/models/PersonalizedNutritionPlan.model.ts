import mongoose, { Document, Schema } from "mongoose";

export interface IMealTarget {
  mealType: "breakfast" | "lunch" | "dinner";
  title: string;
  calorieTarget: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  caloriePercentage: number;
  timingAdvice: string;
  macroFocus: string;
}

export interface IBiometricsSnapshot {
  bmi: number;
  bmiCategory: "underweight" | "normal" | "overweight" | "obese";
  weightKg?: number;
  heightCm?: number;
  age?: number;
  gender?: string;
  fitnessGoal: string;
  activityLevel?: string;
  isDefaultBaseline?: boolean;
}

export interface IDailyTargets {
  totalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  hydrationLiters: number;
}

export interface IMacroDistribution {
  proteinPct: number;
  carbsPct: number;
  fatPct: number;
}

export interface IStrategyNotes {
  summary: string;
  caloricStrategy: string;
  hydrationAdvice: string;
  mealPacingAdvice: string;
}

export interface IPersonalizedNutritionPlan extends Document {
  userId: string;
  userEmail?: string;
  biometricsSnapshot: IBiometricsSnapshot;
  dailyTargets: IDailyTargets;
  macroDistribution: IMacroDistribution;
  mealTargets: {
    breakfast: IMealTarget;
    lunch: IMealTarget;
    dinner: IMealTarget;
  };
  strategyNotes: IStrategyNotes;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const MealTargetSchema = new Schema<IMealTarget>(
  {
    mealType: {
      type: String,
      enum: ["breakfast", "lunch", "dinner"],
      required: true,
    },
    title: { type: String, required: true },
    calorieTarget: { type: Number, required: true },
    proteinGrams: { type: Number, required: true },
    carbsGrams: { type: Number, required: true },
    fatGrams: { type: Number, required: true },
    caloriePercentage: { type: Number, required: true },
    timingAdvice: { type: String, required: true },
    macroFocus: { type: String, required: true },
  },
  { _id: false }
);

const PersonalizedNutritionPlanSchema = new Schema<IPersonalizedNutritionPlan>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    biometricsSnapshot: {
      bmi: { type: Number, required: true },
      bmiCategory: {
        type: String,
        enum: ["underweight", "normal", "overweight", "obese"],
        required: true,
      },
      weightKg: { type: Number },
      heightCm: { type: Number },
      age: { type: Number },
      gender: { type: String },
      fitnessGoal: { type: String, required: true },
      activityLevel: { type: String },
      isDefaultBaseline: { type: Boolean, default: false },
    },
    dailyTargets: {
      totalCalories: { type: Number, required: true },
      proteinGrams: { type: Number, required: true },
      carbsGrams: { type: Number, required: true },
      fatGrams: { type: Number, required: true },
      hydrationLiters: { type: Number, required: true },
    },
    macroDistribution: {
      proteinPct: { type: Number, required: true },
      carbsPct: { type: Number, required: true },
      fatPct: { type: Number, required: true },
    },
    mealTargets: {
      breakfast: { type: MealTargetSchema, required: true },
      lunch: { type: MealTargetSchema, required: true },
      dinner: { type: MealTargetSchema, required: true },
    },
    strategyNotes: {
      summary: { type: String, required: true },
      caloricStrategy: { type: String, required: true },
      hydrationAdvice: { type: String, required: true },
      mealPacingAdvice: { type: String, required: true },
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    collection: "personalizednutritionplans",
  }
);

export const PersonalizedNutritionPlan =
  mongoose.models.PersonalizedNutritionPlan ||
  mongoose.model<IPersonalizedNutritionPlan>(
    "PersonalizedNutritionPlan",
    PersonalizedNutritionPlanSchema
  );

export default PersonalizedNutritionPlan;
