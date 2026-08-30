import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/apiResponse";

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
      return res.status(400).json(
        errorResponse("All fields are required", "VALIDATION_ERROR", 400)
      );
    }

    const bmr =
      gender === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

    const tdee = bmr * activityLevel;

    const protein = (tdee * 0.3) / 4;
    const carbs = (tdee * 0.4) / 4;
    const fats = (tdee * 0.3) / 9;

    return res.status(200).json(
      successResponse("Nutrition calculated successfully", {
        tdee: Math.round(tdee),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fats: Math.round(fats),
      })
    );
  } catch (error) {
    return res.status(500).json(
      errorResponse(
        "Failed to calculate nutrition",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};