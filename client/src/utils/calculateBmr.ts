export type Gender = "male" | "female";

export const calculateBmr = (
  age: number,
  gender: Gender,
  weight: number,
  height: number
): number => {
  if (age <= 0 || weight <= 0 || height <= 0) {
    return 0;
  }

  const bmr =
    gender === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

  return Math.max(Math.round(bmr), 0);
};