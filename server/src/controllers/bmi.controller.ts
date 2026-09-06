import { Request, Response } from "express";
import BMI from "../models/bmi.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

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
      return res.status(400).json(
        errorResponse("Height, weight, BMI, BMR and TDEE are required", "VALIDATION_ERROR", 400)
      );
    }

    const history = await BMI.create({
      userId,
      height,
      weight,
      bmi,
      bmr,
      tdee,
    });

    return res.status(201).json(
      successResponse("BMI history saved successfully", history)
    );
  } catch (error) {
    console.error("Create BMI history error:", error);

    return res.status(500).json(
      errorResponse(
        "Failed to save BMI history",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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

    return res.status(200).json(
      successResponse("BMI history retrieved successfully", {
        count: history.length,
        history,
      })
    );
  } catch (error) {
    console.error("Get BMI history error:", error);

    return res.status(500).json(
      errorResponse(
        "Failed to fetch BMI history",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(404).json(
        errorResponse("BMI history entry not found", "BMI_ENTRY_NOT_FOUND", 404)
      );
    }

    return res.status(200).json(
      successResponse("BMI history updated successfully", history)
    );
  } catch (error) {
    console.error("Update BMI history error:", error);

    return res.status(500).json(
      errorResponse(
        "Failed to update BMI history",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
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
      return res.status(404).json(
        errorResponse("BMI history entry not found", "BMI_ENTRY_NOT_FOUND", 404)
      );
    }

    return res.status(200).json(
      successResponse("BMI history deleted successfully", {})
    );
  } catch (error) {
    console.error("Delete BMI history error:", error);

    return res.status(500).json(
      errorResponse(
        "Failed to delete BMI history",
        error instanceof Error ? error.message : "Internal Server Error",
        500
      )
    );
  }
};