export interface MacroResult {
  protein: number;
  carbs: number;
  fats: number;
}

export const calculateMacros = (
  calories: number
): MacroResult => {
  if (calories <= 0) {
    throw new Error("Calories must be greater than zero");
  }

  const protein = Math.round((calories * 0.30) / 4);
  const carbs = Math.round((calories * 0.40) / 4);
  const fats = Math.round((calories * 0.30) / 9);

  return {
    protein,
    carbs,
    fats,
  };
};