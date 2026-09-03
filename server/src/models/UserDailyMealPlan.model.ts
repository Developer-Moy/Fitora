import mongoose, { Document, Schema } from "mongoose";

export interface IUserDailyMealPlan extends Document {
  userId: string;
  mealId: string;
  name: string;
  calories: number;
  description: string;
  ingredients: string[];
  img: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserDailyMealPlanSchema = new Schema<IUserDailyMealPlan>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    mealId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    calories: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "usersdailymealplan",
  }
);

export const UserDailyMealPlan =
  mongoose.models.UserDailyMealPlan ||
  mongoose.model<IUserDailyMealPlan>(
    "UserDailyMealPlan",
    UserDailyMealPlanSchema
  );

export default UserDailyMealPlan;
