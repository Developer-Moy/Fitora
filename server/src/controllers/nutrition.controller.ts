import { Request, Response } from "express";

export const calculateNutrition = (
  req: Request,
  res: Response
) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
    } = req.body;

    if (
      !age ||
      !gender ||
      !height ||
      !weight ||
      !activityLevel
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activityLevel;

    const protein = (tdee * 0.3) / 4;
    const carbs = (tdee * 0.4) / 4;
    const fats = (tdee * 0.3) / 9;

    return res.status(200).json({
      success: true,
      data: {
        tdee: Math.round(tdee),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to calculate nutrition",
    });
  }
};