export type ActivityLevel =
  | 1.2
  | 1.375
  | 1.55
  | 1.725
  | 1.9;

/**
 * Calculates daily recommended hydration target.
 *
 * Base formula:
 * Weight (kg) × 0.033 = liters
 *
 * Activity adjustment:
 * 1.2   -> +0 L
 * 1.375 -> +0.5 L
 * 1.55  -> +0.5 L
 * 1.725 -> +1 L
 * 1.9   -> +1 L
 */
export const calculateHydrationTarget = (
  weightKg: number,
  activityLevel: ActivityLevel
): number => {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    return 0;
  }

  const baseHydration = weightKg * 0.033;

  let activityExtra = 0;

  if (activityLevel >= 1.725) {
    activityExtra = 1;
  } else if (activityLevel >= 1.375) {
    activityExtra = 0.5;
  }

  const totalHydration = baseHydration + activityExtra;

  return Number(totalHydration.toFixed(1));
};