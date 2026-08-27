export const calculateTdee = (
  bmr: number,
  activityLevel: number
): number => {
  if (bmr <= 0 || activityLevel <= 0) {
    throw new Error(
      "BMR and activity level must be greater than zero"
    );
  }

  return Math.round(bmr * activityLevel);
};