export const calculateTdee = (
  bmr: number,
  activityLevel: number
): number => {
  if (bmr <= 0 || activityLevel <= 0) {
    return 0;
  }

  return Math.max(Math.round(bmr * activityLevel), 0);
};