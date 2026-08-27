import { Request, Response } from "express";

import BMIHistory from "../models/BMIHistory.model";

import { calculateBmi } from "../utils/calculateBmi";
import { calculateBmr, Gender } from "../utils/calculateBmr";
import { calculateTdee } from "../utils/calculateTdee";
import { calculateMacros } from "../utils/calculateMacros";
import { getHealthAdvisory } from "../utils/healthAdvisory";


// =====================================================
// FIT-301 + FIT-303
// POST /api/bmi/calculate
// =====================================================

export const calculateMetrics = (
  req: Request,
  res: Response
): void => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
    } = req.body;

    if (
      age === undefined ||
      gender === undefined ||
      height === undefined ||
      weight === undefined ||
      activityLevel === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "Age, gender, height, weight and activityLevel are required",
        statusCode: 400,
      });

      return;
    }

    if (!["male", "female"].includes(gender)) {
      res.status(400).json({
        success: false,
        message: "Gender must be male or female",
        statusCode: 400,
      });

      return;
    }

    const numericAge = Number(age);
    const numericHeight = Number(height);
    const numericWeight = Number(weight);
    const numericActivityLevel = Number(activityLevel);

    if (
      !Number.isFinite(numericAge) ||
      !Number.isFinite(numericHeight) ||
      !Number.isFinite(numericWeight) ||
      !Number.isFinite(numericActivityLevel)
    ) {
      res.status(400).json({
        success: false,
        message: "All numeric values must be valid numbers",
        statusCode: 400,
      });

      return;
    }

    const bmi = calculateBmi(
      numericWeight,
      numericHeight
    );

    const bmr = calculateBmr(
      numericAge,
      gender as Gender,
      numericWeight,
      numericHeight
    );

    const tdee = calculateTdee(
      bmr,
      numericActivityLevel
    );

    const advisory = getHealthAdvisory(
      bmi,
      numericHeight
    );

    res.status(200).json({
      success: true,
      message: "BMI, BMR and TDEE calculated successfully",
      data: {
        bmi,
        bmr,
        tdee,

        category: advisory.category,
        riskLevel: advisory.riskLevel,
        advisory: advisory.advisory,

        idealWeightRange:
          advisory.idealWeightRange,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate health metrics",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      statusCode: 500,
    });
  }
};


// =====================================================
// FIT-301
// POST /api/bmi/macros
// =====================================================

export const calculateMacroSplit = (
  req: Request,
  res: Response
): void => {
  try {
    const { calories } = req.body;

    if (calories === undefined) {
      res.status(400).json({
        success: false,
        message: "Calories are required",
        statusCode: 400,
      });

      return;
    }

    const numericCalories = Number(calories);

    if (
      !Number.isFinite(numericCalories) ||
      numericCalories <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Calories must be a valid positive number",
        statusCode: 400,
      });

      return;
    }

    const macros = calculateMacros(
      numericCalories
    );

    res.status(200).json({
      success: true,
      message: "Macro split calculated successfully",
      data: {
        calories: numericCalories,
        macros,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to calculate macro split",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      statusCode: 500,
    });
  }
};


// =====================================================
// FIT-302
// POST /api/bmi/history
// =====================================================

export const createBMIHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        statusCode: 401,
      });

      return;
    }

    const {
      age,
      gender,
      height,
      weight,
      activityLevel,
    } = req.body;

    if (
      age === undefined ||
      gender === undefined ||
      height === undefined ||
      weight === undefined ||
      activityLevel === undefined
    ) {
      res.status(400).json({
        success: false,
        message:
          "Age, gender, height, weight and activityLevel are required",
        statusCode: 400,
      });

      return;
    }

    const numericAge = Number(age);
    const numericHeight = Number(height);
    const numericWeight = Number(weight);
    const numericActivityLevel =
      Number(activityLevel);

    const bmi = calculateBmi(
      numericWeight,
      numericHeight
    );

    const bmr = calculateBmr(
      numericAge,
      gender as Gender,
      numericWeight,
      numericHeight
    );

    const tdee = calculateTdee(
      bmr,
      numericActivityLevel
    );

    const advisory = getHealthAdvisory(
      bmi,
      numericHeight
    );

    const history = await BMIHistory.create({
      userId,
      age: numericAge,
      gender,
      height: numericHeight,
      weight: numericWeight,
      bmi,
      bmr,
      tdee,
      bmiCategory: advisory.category,
      riskLevel: advisory.riskLevel,
      idealWeightRange:
        advisory.idealWeightRange,
    });

    res.status(201).json({
      success: true,
      message: "BMI history created successfully",
      data: history,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create BMI history",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      statusCode: 500,
    });
  }
};


// =====================================================
// FIT-302
// GET /api/bmi/history
// =====================================================

export const getBMIHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        statusCode: 401,
      });

      return;
    }

    const history = await BMIHistory.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "BMI history retrieved successfully",
      data: history,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve BMI history",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      statusCode: 500,
    });
  }
};


// =====================================================
// FIT-302
// DELETE /api/bmi/history/:id
// =====================================================

export const deleteBMIHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
        statusCode: 401,
      });

      return;
    }

    const { id } = req.params;

    const history =
      await BMIHistory.findOneAndDelete({
        _id: id,
        userId,
      });

    if (!history) {
      res.status(404).json({
        success: false,
        message:
          "BMI history not found or you do not have permission to delete it",
        statusCode: 404,
      });

      return;
    }

    res.status(200).json({
      success: true,
      message: "BMI history deleted successfully",
      data: {
        id: history._id,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete BMI history",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
      statusCode: 500,
    });
  }
};