import BMIHistory from "../models/BMIHistory.model";

type Gender = "male" | "female";

type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "veryActive";

type GoalType = "Bulking" | "Cutting" | "Maintenance";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9,
};

export const calculateBMI = (
  height: number,
  weight: number,
): number => {
  const heightInMeters = height / 100;

  return Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(1),
  );
};

export const calculateBMR = (
  height: number,
  weight: number,
  age: number,
  gender: Gender,
): number => {
  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  return Math.round(bmr);
};

export const calculateTDEE = (
  bmr: number,
  activityLevel: ActivityLevel,
): number => {
  return Math.round(
    bmr * activityMultipliers[activityLevel],
  );
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";

  return "Obese";
};

export const getRiskLevel = (bmi: number): string => {
  if (bmi < 18.5) return "Low";
  if (bmi < 25) return "Low";
  if (bmi < 30) return "Moderate";

  return "High";
};

export const calculateIdealWeightRange = (
  height: number,
) => {
  const heightInMeters = height / 100;

  return {
    min: Number(
      (18.5 * heightInMeters * heightInMeters).toFixed(1),
    ),
    max: Number(
      (24.9 * heightInMeters * heightInMeters).toFixed(1),
    ),
  };
};

export const calculateTargetCalories = (
  tdee: number,
  goalType: GoalType = "Maintenance",
): number => {
  if (goalType === "Bulking") {
    return tdee + 500;
  }

  if (goalType === "Cutting") {
    return Math.max(tdee - 500, 1200);
  }

  return tdee;
};

export const calculateMacros = (
  weight: number,
  targetCalories: number,
) => {
  const protein = Math.round(weight * 2);

  const fatCalories = targetCalories * 0.25;
  const fat = Math.round(fatCalories / 9);

  const proteinCalories = protein * 4;
  const remainingCalories =
    targetCalories - proteinCalories - fatCalories;

  const carbs = Math.max(
    0,
    Math.round(remainingCalories / 4),
  );

  return {
    protein,
    carbs,
    fat,
  };
};

interface CreateBMIHistoryData {
  userId: string;
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: ActivityLevel;
  goalType?: GoalType;
}

export const createBMIHistory = async (
  data: CreateBMIHistoryData,
) => {
  const {
    userId,
    age,
    gender,
    height,
    weight,
    activityLevel,
    goalType = "Maintenance",
  } = data;

  const bmi = calculateBMI(height, weight);

  const bmr = calculateBMR(
    height,
    weight,
    age,
    gender,
  );

  const tdee = calculateTDEE(
    bmr,
    activityLevel,
  );

  const bmiCategory = getBMICategory(bmi);

  const riskLevel = getRiskLevel(bmi);

  const idealWeightRange =
    calculateIdealWeightRange(height);

  const targetCalories = calculateTargetCalories(
    tdee,
    goalType,
  );

  const macros = calculateMacros(
    weight,
    targetCalories,
  );

  return BMIHistory.create({
    userId,
    age,
    gender,
    height,
    weight,
    bmi,
    bmr,
    tdee,
    targetCalories,
    macros,
    bmiCategory,
    riskLevel,
    idealWeightRange,
  });
};

export const getUserBMIHistory = async (
  userId: string,
) => {
  return BMIHistory.find({
    userId,
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const deleteUserBMIHistory = async (
  userId: string,
  historyId: string,
) => {
  return BMIHistory.findOneAndDelete({
    _id: historyId,
    userId,
  });
};