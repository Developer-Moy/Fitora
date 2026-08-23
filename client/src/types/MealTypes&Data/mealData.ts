import type { DietType } from "./mealTypes";

export const DIET_TYPES: DietType[] = [
  "Omnivore",
  "Vegetarian",
  "Vegan",
  "Keto",
  "Paleo",
  "Gluten-Free",
  "Pescetarian",
];

export const ACTIVITY_LEVELS = [
  {
    value: "Sedentary",
    description: "Office job, minimal daily movement, no exercise.",
  },
  {
    value: "Lightly Active",
    description: "Light exercise or walking 1-3 days per week.",
  },
  {
    value: "Moderately Active",
    description: "Moderate exercise or sports 3-5 days per week.",
  },
  {
    value: "Very Active",
    description: "Intense exercise or physically demanding job 6-7 days per week.",
  },
];

export const FITNESS_GOALS = [
  {
    value: "Weight Loss",
    description: "Caloric deficit with high protein for fat loss.",
  },
  {
    value: "Muscle Gain",
    description: "Surplus calories with elevated protein for growth.",
  },
  {
    value: "Maintain",
    description: "Balanced intake to hold current body composition.",
  },
  {
    value: "Performance",
    description: "Carb-focused fueling for endurance and strength output.",
  },
  {
    value: "Build lean muscle and decrease body fat percentage",
    description: "Recomposition approach: protein-forward, moderate deficit.",
  },
];
