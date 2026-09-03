/**
 * Calorie Estimation Service
 *
 * Provides MET-based calorie burn estimation for workout sessions.
 *
 * IMPORTANT: These are ESTIMATES only and should not be considered
 * medically accurate. Actual calorie burn varies significantly based on
 * individual factors including fitness level, body composition, intensity,
 * and metabolic rate.
 *
 * Formula: Calories = MET × bodyWeightKg × durationHours
 */

/**
 * MET (Metabolic Equivalent of Task) values for different workout types.
 * Based on general exercise physiology estimates.
 */
const MET_VALUES: Record<string, number> = {
  HIIT: 8,
  TABATA: 8,
  BOXING: 10,
  CARDIO: 7,
  STRENGTH: 6,
  GENERAL: 5,
};

/**
 * Default MET value for unknown workout types
 */
const DEFAULT_MET = 5;

/**
 * Default weight fallback (in kg) if weight is not provided
 * 70kg is approximately the global average adult weight
 */
const DEFAULT_WEIGHT_KG = 70;

export interface CalorieEstimationInput {
  workoutType?: string;
  weightKg?: number;
  durationMinutes: number;
}

export interface CalorieEstimationResult {
  estimatedCalories: number;
  metValue: number;
  isEstimate: true;
  usedDefaultWeight: boolean;
  disclaimer: string;
}

/**
 * Estimates calorie burn for a workout session using MET-based calculation.
 *
 * @param input - Workout parameters
 * @returns Estimated calorie burn with metadata
 */
export function estimateCalories(
  input: CalorieEstimationInput
): CalorieEstimationResult {
  const { workoutType, weightKg, durationMinutes } = input;

  // Determine MET value based on workout type
  const normalizedWorkoutType = workoutType?.toUpperCase().trim();
  const metValue = normalizedWorkoutType && MET_VALUES[normalizedWorkoutType]
    ? MET_VALUES[normalizedWorkoutType]
    : DEFAULT_MET;

  // Use provided weight or fallback to default
  const effectiveWeight = weightKg ?? DEFAULT_WEIGHT_KG;
  const usedDefaultWeight = weightKg === undefined || weightKg === null;

  // Convert duration to hours
  const durationHours = durationMinutes / 60;

  // Calculate estimated calories: MET × weight(kg) × duration(hours)
  const estimatedCalories = Math.round(metValue * effectiveWeight * durationHours);

  return {
    estimatedCalories,
    metValue,
    isEstimate: true,
    usedDefaultWeight,
    disclaimer:
      "This is an estimate based on MET values and may not reflect actual calorie burn.",
  };
}

/**
 * Gets the MET value for a specific workout type
 *
 * @param workoutType - Type of workout
 * @returns MET value or default if not found
 */
export function getMetValue(workoutType?: string): number {
  if (!workoutType) {
    return DEFAULT_MET;
  }
  const normalized = workoutType.toUpperCase().trim();
  return MET_VALUES[normalized] ?? DEFAULT_MET;
}
