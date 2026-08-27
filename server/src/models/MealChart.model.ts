import { Schema, model, Document } from "mongoose";

export type Gender = "Male" | "Female" | "Other";

export type DietType =
  | "Omnivore"
  | "Vegetarian"
  | "Vegan"
  | "Keto"
  | "Paleo"
  | "Gluten-Free"
  | "Pescetarian";

export interface IUserProfileData {
  age: number;
  gender: Gender | "";
  weight: number;
}

export interface IGoalsLifestyleData {
  fitnessGoal: string;
  customGoal?: string;
  activityLevel: string;
}

export interface IDietaryPreferencesData {
  dietType: DietType | "";
  allergies: string;
}

export interface IMealStructureData {
  mealsPerDay: number;
  dislikes: string;
  preferredCuisine: string;
}

export interface IMealSlot {
  recommendedMeal: string;
  calories: number;
}

export interface IDailyMealSchedule {
  dayName: string;
  breakfast: IMealSlot;
  lunch: IMealSlot;
  snack: IMealSlot;
  dinner: IMealSlot;
}

export interface IWeeklySchedule {
  monday: IDailyMealSchedule;
  tuesday: IDailyMealSchedule;
  wednesday: IDailyMealSchedule;
  thursday: IDailyMealSchedule;
  friday: IDailyMealSchedule;
  saturday: IDailyMealSchedule;
  sunday: IDailyMealSchedule;
}

export interface IMealPlan {
  userId?: string;
  profile: IUserProfileData;
  goals: IGoalsLifestyleData;
  dietary: IDietaryPreferencesData;
  structure: IMealStructureData;
  weeklySchedule?: IWeeklySchedule;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMealPlanDocument extends IMealPlan, Document {}

const UserProfileSchema = new Schema<IUserProfileData>(
  {
    age: { type: Number, required: true, min: 1, max: 150 },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      required: true,
    },
    weight: { type: Number, required: true, min: 1, max: 500 },
  },
  { _id: false }
);

const GoalsLifestyleSchema = new Schema<IGoalsLifestyleData>(
  {
    fitnessGoal: { type: String, required: true },
    customGoal: { type: String, default: "", maxlength: 100 },
    activityLevel: { type: String, required: true },
  },
  { _id: false }
);

const DietaryPreferencesSchema = new Schema<IDietaryPreferencesData>(
  {
    dietType: {
      type: String,
      enum: [
        "Omnivore",
        "Vegetarian",
        "Vegan",
        "Keto",
        "Paleo",
        "Gluten-Free",
        "Pescetarian",
        "",
      ],
      required: true,
    },
    allergies: { type: String, required: true, maxlength: 250 },
  },
  { _id: false }
);

const MealStructureSchema = new Schema<IMealStructureData>(
  {
    mealsPerDay: { type: Number, required: true, min: 1, max: 10 },
    dislikes: { type: String, required: true, maxlength: 150 },
    preferredCuisine: { type: String, required: true, maxlength: 50 },
  },
  { _id: false }
);

const MealSlotSchema = new Schema<IMealSlot>(
  {
    recommendedMeal: { type: String, required: true },
    calories: { type: Number, required: true },
  },
  { _id: false }
);

const DailyMealScheduleSchema = new Schema<IDailyMealSchedule>(
  {
    dayName: { type: String, required: true },
    breakfast: { type: MealSlotSchema, required: true },
    lunch: { type: MealSlotSchema, required: true },
    snack: { type: MealSlotSchema, required: true },
    dinner: { type: MealSlotSchema, required: true },
  },
  { _id: false }
);

const WeeklyScheduleSchema = new Schema<IWeeklySchedule>(
  {
    monday: { type: DailyMealScheduleSchema, required: false },
    tuesday: { type: DailyMealScheduleSchema, required: false },
    wednesday: { type: DailyMealScheduleSchema, required: false },
    thursday: { type: DailyMealScheduleSchema, required: false },
    friday: { type: DailyMealScheduleSchema, required: false },
    saturday: { type: DailyMealScheduleSchema, required: false },
    sunday: { type: DailyMealScheduleSchema, required: false },
  },
  { _id: false }
);

export const MealPlanSchema = new Schema<IMealPlanDocument>(
  {
    userId: {
      type: String,
      required: false,
    },
    profile: {
      type: UserProfileSchema,
      required: true,
    },
    goals: {
      type: GoalsLifestyleSchema,
      required: true,
    },
    dietary: {
      type: DietaryPreferencesSchema,
      required: true,
    },
    structure: {
      type: MealStructureSchema,
      required: true,
    },
    weeklySchedule: {
      type: WeeklyScheduleSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const MealPlan = model<IMealPlanDocument>("MealPlan", MealPlanSchema);
export const MealChart = MealPlan;

export default MealPlan;
