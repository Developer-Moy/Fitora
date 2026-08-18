export const calculateBmi = (
  weight: number,
  height: number
): number => {
  const heightInMeters = height / 100;

  return Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(1)
  );
};