import { Request, Response } from "express";
import BMI from "../models/bmi.model";

// POST /api/bmi/history
export const createBMIHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      height,
      weight,
      bmi,
      bmr,
      tdee,
    } = req.body;

    if (
      height === undefined ||
      weight === undefined ||
      bmi === undefined ||
      bmr === undefined ||
      tdee === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Height, weight, BMI, BMR and TDEE are required",
      });
    }

    const history = await BMI.create({
      userId,
      height,
      weight,
      bmi,
      bmr,
      tdee,
    });

    return res.status(201).json({
      success: true,
      message: "BMI history saved successfully",
      data: history,
    });
  } catch (error) {
    console.error("Create BMI history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save BMI history",
    });
  }
};

// GET /api/bmi/history
export const getBMIHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.query;

    const filter = userId
      ? { userId: String(userId) }
      : {};

    const history = await BMI.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    console.error("Get BMI history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch BMI history",
    });
  }
};

// PUT /api/bmi/history/:id
export const updateBMIHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const history = await BMI.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "BMI history entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "BMI history updated successfully",
      data: history,
    });
  } catch (error) {
    console.error("Update BMI history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update BMI history",
    });
  }
};

// DELETE /api/bmi/history/:id
export const deleteBMIHistory = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const history = await BMI.findByIdAndDelete(id);

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "BMI history entry not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "BMI history deleted successfully",
    });
  } catch (error) {
    console.error("Delete BMI history error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete BMI history",
    });
  }
};