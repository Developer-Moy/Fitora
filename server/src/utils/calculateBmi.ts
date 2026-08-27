export const calculateBmi = (
  weight: number,
  height: number
): number => {
  if (weight <= 0 || height <= 0) {
    throw new Error("Weight and height must be greater than zero");
  }

  const heightInMeters = height / 100;

  const bmi = weight / (heightInMeters * heightInMeters);

  return Number(bmi.toFixed(1));
};