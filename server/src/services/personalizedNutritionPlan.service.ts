import mongoose from "mongoose";
import PersonalizedNutritionPlan, {
  IPersonalizedNutritionPlan,
} from "../models/PersonalizedNutritionPlan.model.js";
import User from "../models/User.model.js";
import BMIHistory from "../models/BMIHistory.model.js";

/**
 * Normalizes user fitness goal into 4 core analytical vectors
 */
export function normalizeFitnessGoal(goal?: string): {
  normalized: "bulking" | "cutting" | "strength" | "maintenance";
  label: string;
} {
  if (!goal) {
    return { normalized: "bulking", label: "Bulking & Muscle Gain" };
  }

  const clean = goal.toLowerCase().trim();

  if (
    clean.includes("bulk") ||
    clean.includes("muscle") ||
    clean.includes("hypertrophy") ||
    clean.includes("gain")
  ) {
    return { normalized: "bulking", label: "Bulking & Muscle Gain" };
  }

  if (
    clean.includes("cut") ||
    clean.includes("fat") ||
    clean.includes("loss") ||
    clean.includes("shred") ||
    clean.includes("lean")
  ) {
    return { normalized: "cutting", label: "Fat Loss & Cutting" };
  }

  if (
    clean.includes("strength") ||
    clean.includes("performance") ||
    clean.includes("athletic") ||
    clean.includes("conditioning") ||
    clean.includes("recomp")
  ) {
    return { normalized: "strength", label: "Strength & Conditioning" };
  }

  return { normalized: "maintenance", label: "Maintenance" };
}

/**
 * Classifies BMI into WHO clinical categories
 */
export function classifyBmi(
  bmi: number
): "underweight" | "normal" | "overweight" | "obese" {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25.0) return "normal";
  if (bmi < 30.0) return "overweight";
  return "obese";
}

/**
 * Activity multiplier resolution
 */
function getActivityMultiplier(activityLevel?: string): number {
  if (!activityLevel) return 1.55;
  const a = activityLevel.toLowerCase();
  if (a.includes("sedentary") || a.includes("low")) return 1.2;
  if (a.includes("light") || a.includes("1-2")) return 1.375;
  if (a.includes("moderate") || a.includes("3-4") || a.includes("active"))
    return 1.55;
  if (a.includes("very") || a.includes("5-6") || a.includes("intense"))
    return 1.725;
  return 1.55;
}

/**
 * Fetch saved plan by userId
 */
export async function getPlanByUserId(
  userId: string
): Promise<IPersonalizedNutritionPlan | null> {
  if (!userId) return null;
  const plan = await PersonalizedNutritionPlan.findOne({ userId }).lean();
  return plan as unknown as IPersonalizedNutritionPlan | null;
}

/**
 * Core Rule-Based Generation Engine
 * Synthesizes BMI + Fitness Goal + Biometrics into strict numerical targets.
 */
export async function generatePersonalizedNutritionPlan(
  userId: string,
  requestedGoal?: string
): Promise<IPersonalizedNutritionPlan> {
  // 1. Resolve user profile details
  let user: any = null;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    user = await User.findById(userId).lean();
  }
  if (!user) {
    user = await User.findOne({
      $or: [{ email: userId }, { _id: userId }],
    }).lean();
  }

  // 2. Resolve recent BMI history if biometrics missing in user profile
  let latestBmiRecord: any = null;
  if (mongoose.Types.ObjectId.isValid(userId)) {
    latestBmiRecord = await BMIHistory.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();
  }

  // Extract biometrics with safe fallbacks
  const rawWeight = Number(user?.weight || latestBmiRecord?.weight || 0);
  const rawHeight = Number(user?.height || latestBmiRecord?.height || 0);
  const age = Number(latestBmiRecord?.age || 25);
  const gender = (user?.gender || latestBmiRecord?.gender || "male").toLowerCase();
  const activityLevel = user?.activityLevel || "Moderate (3-4 days/week)";

  const isDefaultBaseline = rawWeight <= 0 || rawHeight <= 0;
  const weightKg = !isDefaultBaseline ? rawWeight : 72; // default adult baseline
  const heightCm = !isDefaultBaseline ? rawHeight : 176;

  // 3. Determine BMI & BMI Category
  const calculatedBmi =
    latestBmiRecord?.bmi && !isDefaultBaseline
      ? Number(latestBmiRecord.bmi)
      : Number((weightKg / Math.pow(heightCm / 100, 2)).toFixed(1));

  const bmiCategory = classifyBmi(calculatedBmi);

  // 4. Resolve Fitness Goal
  const goalObj = normalizeFitnessGoal(
    requestedGoal || user?.fitnessGoal || "Bulking & Muscle Gain"
  );
  const fitnessGoalLabel = requestedGoal || user?.fitnessGoal || goalObj.label;

  // 5. Calculate BMR (Mifflin-St Jeor) & Baseline TDEE
  const bmr =
    gender === "female"
      ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
      : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

  const activityMultiplier = getActivityMultiplier(activityLevel);
  const baselineTdee = Math.round(bmr * activityMultiplier);

  // 6. Caloric & Macronutrient Strategy Matrix (BMI + Goal Rule Matrix)
  let calorieOffset = 0;
  let proteinPerKg = 2.0;
  let fatCalorieRatio = 0.25;
  let strategySummary = "";
  let caloricStrategy = "";
  let dailyHydration = 3.6;

  switch (goalObj.normalized) {
    case "bulking":
      if (bmiCategory === "underweight") {
        calorieOffset = 550;
        proteinPerKg = 2.0;
        fatCalorieRatio = 0.28;
        dailyHydration = 3.6;
        strategySummary =
          "Prioritize a clean high-energy surplus to support muscle hyper-trophy and safe bodyweight normalization.";
        caloricStrategy =
          "Robust Caloric Surplus (+550 kcal) to sustain high-volume training anabolism.";
      } else if (bmiCategory === "normal") {
        calorieOffset = 420;
        proteinPerKg = 2.2;
        fatCalorieRatio = 0.25;
        dailyHydration = 3.8;
        strategySummary =
          "Controlled lean surplus to maximize myofibrillar protein synthesis with minimal fat gain.";
        caloricStrategy =
          "Lean Hypertrophic Surplus (+420 kcal) paired with elevated complex carbohydrate intake.";
      } else {
        // Overweight or Obese seeking bulking: prioritize lean recomposition
        calorieOffset = 150;
        proteinPerKg = 2.2;
        fatCalorieRatio = 0.24;
        dailyHydration = 4.0;
        strategySummary =
          "Focused progressive strength protocol with controlled calories to rebuild body composition.";
        caloricStrategy =
          "Conservative Lean Surplus (+150 kcal) preserving metabolic rate while prioritizing dense protein.";
      }
      break;

    case "cutting":
      if (bmiCategory === "underweight") {
        calorieOffset = 100; // Protection rule: do not cut if already underweight
        proteinPerKg = 2.0;
        fatCalorieRatio = 0.26;
        dailyHydration = 3.4;
        strategySummary =
          "Metabolic preservation protocol. Caloric restriction is suspended due to clinical underweight BMI.";
        caloricStrategy =
          "Metabolic Stabilization (+100 kcal) focusing on nutrient-dense recovery.";
      } else if (bmiCategory === "normal") {
        calorieOffset = -420;
        proteinPerKg = 2.3;
        fatCalorieRatio = 0.28;
        dailyHydration = 3.8;
        strategySummary =
          "Precision fat loss deficit with elevated amino acid saturation to strictly prevent muscle catabolism.";
        caloricStrategy =
          "Targeted Caloric Deficit (-420 kcal) maintaining high dietary protein density.";
      } else if (bmiCategory === "overweight") {
        calorieOffset = -550;
        proteinPerKg = 2.2;
        fatCalorieRatio = 0.28;
        dailyHydration = 4.0;
        strategySummary =
          "Accelerated lipid mobilization deficit while safeguarding resting metabolic rate.";
        caloricStrategy =
          "High-Efficiency Deficit (-550 kcal) maximizing fatty acid oxidation during training windows.";
      } else {
        // Obese
        calorieOffset = -650;
        proteinPerKg = 2.0;
        fatCalorieRatio = 0.3;
        dailyHydration = 4.2;
        strategySummary =
          "Clinical fat oxidation protocol with steady blood glucose stability and high satiety.";
        caloricStrategy =
          "Structured Fat Loss Deficit (-650 kcal) prioritizing fiber volume and steady protein pacing.";
      }
      break;

    case "strength":
      calorieOffset = bmiCategory === "overweight" || bmiCategory === "obese" ? -150 : 180;
      proteinPerKg = 2.1;
      fatCalorieRatio = 0.25;
      dailyHydration = 3.6;
      strategySummary =
        "Performance athletic fueling centered around glycogen replenishment and central nervous system recovery.";
      caloricStrategy =
        calorieOffset >= 0
          ? "Athletic Performance Surplus (+180 kcal) for maximal motor unit recruitment."
          : "Athletic Recomposition (-150 kcal) sustaining lifting volume while reducing excess mass.";
      break;

    case "maintenance":
    default:
      calorieOffset = 0;
      proteinPerKg = 1.9;
      fatCalorieRatio = 0.26;
      dailyHydration = 3.4;
      strategySummary =
        "Homeostatic equilibrium fueling to preserve physical conditioning and consistent daily energy.";
      caloricStrategy =
        "Exact Equilibrium (0 kcal net offset) supporting long-term metabolic health and workout stamina.";
      break;
  }

  // 7. Calculate Daily Target Macros
  const targetCalories = Math.max(1400, Math.round(baselineTdee + calorieOffset));
  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  const fatCalories = targetCalories * fatCalorieRatio;
  const fatGrams = Math.round(fatCalories / 9);

  const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
  const carbsGrams = Math.round(carbCalories / 4);

  // Percentages
  const proteinPct = Math.round((proteinCalories / targetCalories) * 100);
  const fatPct = Math.round((fatCalories / targetCalories) * 100);
  const carbsPct = Math.max(0, 100 - proteinPct - fatPct);

  // 8. Meal Target Partitioning (NO SPECIFIC FOODS)
  // Breakfast: 28% of daily energy
  const bCal = Math.round(targetCalories * 0.28);
  const bProt = Math.round(proteinGrams * 0.28);
  const bCarb = Math.round(carbsGrams * 0.3);
  const bFat = Math.round(fatGrams * 0.24);

  // Lunch: 42% of daily energy
  const lCal = Math.round(targetCalories * 0.42);
  const lProt = Math.round(proteinGrams * 0.42);
  const lCarb = Math.round(carbsGrams * 0.44);
  const lFat = Math.round(fatGrams * 0.42);

  // Dinner: Remaining 30% of daily energy
  const dCal = Math.max(300, targetCalories - bCal - lCal);
  const dProt = Math.max(20, proteinGrams - bProt - lProt);
  const dCarb = Math.max(20, carbsGrams - bCarb - lCarb);
  const dFat = Math.max(10, fatGrams - bFat - lFat);

  // 9. Construct Meal Targets
  const mealTargets = {
    breakfast: {
      mealType: "breakfast" as const,
      title: "Breakfast • Morning Metabolic Fuel",
      calorieTarget: bCal,
      proteinGrams: bProt,
      carbsGrams: bCarb,
      fatGrams: bFat,
      caloriePercentage: 28,
      timingAdvice: "Consume within 60–90 minutes of waking to reverse overnight catabolism.",
      macroFocus:
        "Fast-absorbing amino acids paired with complex sustained carbohydrates for morning stamina.",
    },
    lunch: {
      mealType: "lunch" as const,
      title: "Lunch • Midday Peak Performance Window",
      calorieTarget: lCal,
      proteinGrams: lProt,
      carbsGrams: lCarb,
      fatGrams: lFat,
      caloriePercentage: 42,
      timingAdvice:
        "Consume 2–3 hours pre-workout or within 90 minutes post-training for maximum glycogen synthesis.",
      macroFocus:
        "Highest daily density of complete proteins and clean complex carbohydrates to sustain peak output.",
    },
    dinner: {
      mealType: "dinner" as const,
      title: "Dinner • Overnight Anabolic Recovery",
      calorieTarget: dCal,
      proteinGrams: dProt,
      carbsGrams: dCarb,
      fatGrams: dFat,
      caloriePercentage: 30,
      timingAdvice:
        "Consume 2.5–3 hours prior to sleep to prevent gastrointestinal stress and optimize REM sleep.",
      macroFocus:
        "Satiating protein with fiber-rich low-glycemic carbohydrates and healthy mono/polyunsaturated fats.",
    },
  };

  // 10. Construct Strategy Notes
  const strategyNotes = {
    summary: strategySummary,
    caloricStrategy,
    hydrationAdvice: `Target a minimum of ${dailyHydration} L of water daily. Sip 500ml upon waking and 750ml during workout windows.`,
    mealPacingAdvice:
      "Maintain a 3.5 to 4.5 hour interval between meals. Select whichever clean whole foods you prefer that help you meet these macro targets.",
  };

  // 11. Check Existing Version
  const existingPlan = await PersonalizedNutritionPlan.findOne({ userId });
  const version = existingPlan ? existingPlan.version + 1 : 1;

  // 12. Upsert to MongoDB
  const planData = {
    userId,
    userEmail: user?.email || undefined,
    biometricsSnapshot: {
      bmi: calculatedBmi,
      bmiCategory,
      weightKg,
      heightCm,
      age,
      gender,
      fitnessGoal: fitnessGoalLabel,
      activityLevel,
      isDefaultBaseline,
    },
    dailyTargets: {
      totalCalories: targetCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      hydrationLiters: dailyHydration,
    },
    macroDistribution: {
      proteinPct,
      carbsPct,
      fatPct,
    },
    mealTargets,
    strategyNotes,
    version,
  };

  const savedPlan = await PersonalizedNutritionPlan.findOneAndUpdate(
    { userId },
    { $set: planData },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return savedPlan;
}
