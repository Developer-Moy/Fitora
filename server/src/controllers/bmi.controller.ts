import { Request, Response } from "express";
import BMI from "../models/bmi.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

// POST /api/bmi/history
export const createBMIHistory = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      height,
      heightCm,
      weight,
      weightKg,
      bmi,
      bmiScore,
      bmr,
      tdee,
    } = req.body;

    const numHeight = Number(height ?? heightCm);
    const numWeight = Number(weight ?? weightKg);
    const numBmi = Number(bmi ?? bmiScore);

    if (
      isNaN(numHeight) ||
      numHeight <= 0 ||
      isNaN(numWeight) ||
      numWeight <= 0 ||
      isNaN(numBmi) ||
      numBmi <= 0
    ) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Valid height, weight, and BMI are required",
            "VALIDATION_ERROR",
            400,
          ),
        );
    }

    // Fallback BMR and TDEE using Mifflin-St Jeor formula if not provided
    const numBmr =
      bmr !== undefined && !isNaN(Number(bmr))
        ? Number(bmr)
        : Math.round(10 * numWeight + 6.25 * numHeight - 5 * 25 + 5);

    const numTdee =
      tdee !== undefined && !isNaN(Number(tdee))
        ? Number(tdee)
        : Math.round(numBmr * 1.375);

    const authUser = (req as any).user;
    const finalUserId =
      userId ||
      authUser?.userId ||
      authUser?._id ||
      authUser?.id ||
      "guest_user";

    const history = await BMI.create({
      userId: finalUserId,
      height: numHeight,
      weight: numWeight,
      bmi: numBmi,
      bmr: numBmr,
      tdee: numTdee,
      statusCategory: req.body.statusCategory || req.body.status,
    });

    return res
      .status(201)
      .json(successResponse("BMI history saved successfully", history));
  } catch (error) {
    console.error("Create BMI history error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to save BMI history",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

// GET /api/bmi/history
export const getBMIHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;

    const filter = userId ? { userId: String(userId) } : {};

    const history = await BMI.find(filter).sort({ createdAt: -1 }).lean();

    return res.status(200).json(
      successResponse("BMI history retrieved successfully", {
        count: history.length,
        history,
      }),
    );
  } catch (error) {
    console.error("Get BMI history error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to fetch BMI history",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

// PUT /api/bmi/history/:id
export const updateBMIHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const history = await BMI.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!history) {
      return res
        .status(404)
        .json(
          errorResponse(
            "BMI history entry not found",
            "BMI_ENTRY_NOT_FOUND",
            404,
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("BMI history updated successfully", history));
  } catch (error) {
    console.error("Update BMI history error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to update BMI history",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};

// DELETE /api/bmi/history/:id
export const deleteBMIHistory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const history = await BMI.findByIdAndDelete(id);

    if (!history) {
      return res
        .status(404)
        .json(
          errorResponse(
            "BMI history entry not found",
            "BMI_ENTRY_NOT_FOUND",
            404,
          ),
        );
    }

    return res
      .status(200)
      .json(successResponse("BMI history deleted successfully", {}));
  } catch (error) {
    console.error("Delete BMI history error:", error);

    return res
      .status(500)
      .json(
        errorResponse(
          "Failed to delete BMI history",
          error instanceof Error ? error.message : "Internal Server Error",
          500,
        ),
      );
  }
};
