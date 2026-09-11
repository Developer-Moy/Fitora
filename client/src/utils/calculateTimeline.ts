export interface TimelineResult {
  weightDifference: number;
  estimatedWeeks: number;
  weeks: number;
  estimatedDays: number;
  dailyCalorieAdjustment: number;
}

export interface CalculateTimelineOptions {
  currentWeight: number;
  targetWeight: number;
  dailyCalorieChange?: number;
  dailyCalorieAdjustment?: number;
}

/**
 * Calculates estimated time to reach target weight.
 *
 * Assumption:
 * - 1 kg body weight ≈ 7,700 kcal
 * - 500 kcal daily deficit/surplus ≈ 0.45 kg/week
 *dashboard e master admin, branch admin, free user, primium user sob kisu backend e connect koro and sob data dynamic koro kono kisu jeno local e na thake sob mongodb theke asadashboard e master admin, branch admin, free user, primium user sob kisu backend e connect koro and sob data dynamic koro kono kisu jeno local e na thake sob mongodb theke asa
 * @param currentWeight Current weight in kg
 * @param targetWeight Target weight in kg
 * @param dailyCalorieAdjustment Daily calorie deficit/surplus
 * Supports both object options and positional arguments:
 * - calculateTimeline({ currentWeight, targetWeight, dailyCalorieChange })
 * - calculateTimeline(currentWeight, targetWeight, dailyCalorieAdjustment)dashboard e master admin, branch admin, free user, primium user sob kisu backend e connect koro and sob data dynamic koro kono kisu jeno local e na thake sob mongodb theke asa
 */
export function calculateTimeline(
  arg1: number | CalculateTimelineOptions,
  arg2?: number,
  arg3?: number,
): TimelineResult {
  let currentWeight = 0;
  let targetWeight = 0;
  let dailyCalorieAdjustment = 500;

  if (typeof arg1 === "object" && arg1 !== null) {
    currentWeight = Number(arg1.currentWeight) || 0;
    targetWeight = Number(arg1.targetWeight) || 0;
    dailyCalorieAdjustment =
      arg1.dailyCalorieChange !== undefined
        ? Math.abs(arg1.dailyCalorieChange) || 500
        : Math.abs(arg1.dailyCalorieAdjustment || 500);
  } else {
    currentWeight = Number(arg1) || 0;
    targetWeight = Number(arg2) || 0;
    dailyCalorieAdjustment = Math.abs(arg3 || 500);
  }

  if (currentWeight <= 0 || targetWeight <= 0) {
    return {
      weightDifference: 0,
      estimatedWeeks: 0,
      weeks: 0,
      estimatedDays: 0,
      dailyCalorieAdjustment: 0,
    };
  }

  if (currentWeight === targetWeight) {
    return {
      weightDifference: 0,
      estimatedWeeks: 0,
      weeks: 0,
      estimatedDays: 0,
      dailyCalorieAdjustment,
    };
  }

  const weightDifference = Math.abs(currentWeight - targetWeight);

  // Approximately 7,700 kcal is equivalent to 1 kg.
  const totalCaloriesNeeded = weightDifference * 7700;

  // Convert daily calorie deficit/surplus into weekly calorie change.
  const weeklyCalorieAdjustment = Math.max(
    1,
    Math.abs(dailyCalorieAdjustment) * 7,
  );

  // Estimated number of weeks.
  const estimatedWeeks = Math.ceil(
    totalCaloriesNeeded / weeklyCalorieAdjustment,
  );

  const estimatedDays = estimatedWeeks * 7;

  return {
    weightDifference: Number(weightDifference.toFixed(1)),
    estimatedWeeks,
    weeks: estimatedWeeks,
    estimatedDays,
    dailyCalorieAdjustment,
  };
}