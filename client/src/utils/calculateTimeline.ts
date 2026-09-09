export interface TimelineResult {
  weightDifference: number;
  estimatedWeeks: number;
  estimatedDays: number;
  dailyCalorieAdjustment: number;
}

/**
 * Calculates estimated time to reach target weight.
 *
 * Assumption:
 * - 1 kg body weight ≈ 7,700 kcal
 * - 500 kcal daily deficit/surplus ≈ 0.45 kg/week
 *
 * @param currentWeight Current weight in kg
 * @param targetWeight Target weight in kg
 * @param dailyCalorieAdjustment Daily calorie deficit/surplus
 */
export function calculateTimeline(
  currentWeight: number,
  targetWeight: number,
  dailyCalorieAdjustment: number = 500
): TimelineResult {
  if (currentWeight <= 0 || targetWeight <= 0) {
    return {
      weightDifference: 0,
      estimatedWeeks: 0,
      estimatedDays: 0,
      dailyCalorieAdjustment: 0,
    };
  }

  if (currentWeight === targetWeight) {
    return {
      weightDifference: 0,
      estimatedWeeks: 0,
      estimatedDays: 0,
      dailyCalorieAdjustment,
    };
  }

  const weightDifference = Math.abs(currentWeight - targetWeight);

  // Approximately 7,700 kcal is equivalent to 1 kg.
  const totalCaloriesNeeded = weightDifference * 7700;

  // Convert daily calorie deficit/surplus into weekly calorie change.
  const weeklyCalorieAdjustment =
    Math.abs(dailyCalorieAdjustment) * 7;

  // Estimated number of weeks.
  const estimatedWeeks = Math.ceil(
    totalCaloriesNeeded / weeklyCalorieAdjustment
  );

  const estimatedDays = estimatedWeeks * 7;

  return {
    weightDifference: Number(weightDifference.toFixed(1)),
    estimatedWeeks,
    estimatedDays,
    dailyCalorieAdjustment,
  };
}