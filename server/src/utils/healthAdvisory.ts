export interface HealthAdvisory {
  category: string;
  riskLevel: string;
  advisory: string;
  idealWeightRange: {
    min: number;
    max: number;
  };
}

export const getHealthAdvisory = (
  bmi: number,
  height: number
): HealthAdvisory => {
  if (bmi <= 0 || height <= 0) {
    throw new Error("Invalid BMI or height");
  }

  let category: string;
  let riskLevel: string;
  let advisory: string;

  if (bmi < 18.5) {
    category = "Underweight";
    riskLevel = "Low";
    advisory =
      "Your BMI is below the healthy range. Consider focusing on balanced nutrition and healthy weight gain.";
  } else if (bmi < 25) {
    category = "Healthy";
    riskLevel = "Low";
    advisory =
      "Your BMI is within the healthy range. Maintain balanced nutrition and regular physical activity.";
  } else if (bmi < 30) {
    category = "Overweight";
    riskLevel = "Moderate";
    advisory =
      "Your BMI is above the healthy range. Regular physical activity and balanced nutrition may help improve your health.";
  } else {
    category = "Obesity";
    riskLevel = "High";
    advisory =
      "Your BMI is in the obesity range. Consider discussing healthy lifestyle changes with a qualified healthcare professional.";
  }

  const heightInMeters = height / 100;
  const heightSquared = heightInMeters * heightInMeters;

  const minWeight = Number((18.5 * heightSquared).toFixed(1));
  const maxWeight = Number((24.9 * heightSquared).toFixed(1));

  return {
    category,
    riskLevel,
    advisory,
    idealWeightRange: {
      min: minWeight,
      max: maxWeight,
    },
  };
};