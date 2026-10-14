import { Request, Response } from "express";
import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { User } from "../models/User.model";
import { UserFavoriteExercise } from "../models/UserFavoriteExercise.model";
import { successResponse, errorResponse } from "../utils/apiResponse";

// GET /api/exercises
export const getExercises = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { muscleGroup, equipment, difficulty } = req.query;

    const filter: Record<string, unknown> = {};

    // Muscle group filter
    if (muscleGroup) {
      filter.muscle = muscleGroup;
    }

    // Equipment filter
    if (equipment) {
      filter.equipment = equipment;
    }

    // Difficulty filter
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const exercises = await Exercise.find(filter).sort({
      createdAt: -1,
    });

    res.status(200).json(
      successResponse("Exercises fetched successfully", exercises)
    );
  } catch (error) {
    console.error("Get exercises error:", error);

    res.status(500).json(
      errorResponse(
        "Failed to fetch exercises",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

// GET /api/exercises/:id
export const getExerciseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const exercise = await Exercise.findOne({id});

    if (!exercise) {
      res.status(404).json(
        errorResponse("Exercise not found", "EXERCISE_NOT_FOUND", 404)
      );

      return;
    }

    res.status(200).json(
      successResponse("Exercise fetched successfully", exercise)
    );
  } catch (error) {
    console.error("Get exercise by ID error:", error);

    res.status(500).json(
      errorResponse(
        "Failed to fetch exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};


export const createExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      category,
      difficulty,
      duration,
      equipment,
      muscle,
      description,
      tips,
      videoId,
      image,
    } = req.body;

    // 1. Validate required fields
    if (
      !name ||
      !category ||
      !difficulty ||
      !duration ||
      !equipment ||
      !muscle ||
      !description ||
      !videoId ||
      !image
    ) {
      res.status(400).json(
        errorResponse(
          "All required fields must be provided",
          "VALIDATION_ERROR",
          400
        )
      );

      return;
    }

    // 2. Validate difficulty
    const allowedDifficulties = [
      "BEGINNER",
      "INTERMEDIATE",
      "ADVANCED",
    ];

    if (!allowedDifficulties.includes(difficulty)) {
      res.status(400).json(
        errorResponse(
          "Invalid difficulty. Use BEGINNER, INTERMEDIATE, or ADVANCED",
          "INVALID_DIFFICULTY",
          400
        )
      );

      return;
    }

    // 3. Check duplicate exercise name
    const existingExercise = await Exercise.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
    });

    if (existingExercise) {
      res.status(409).json(
        errorResponse(
          "An exercise with this name already exists",
          "EXERCISE_ALREADY_EXISTS",
          409
        )
      );

      return;
    }

    // 4. Generate next numeric ID
    const lastExercise = await Exercise.findOne()
      .sort({ id: -1 })
      .select("id");

    const nextId = lastExercise ? lastExercise.id + 1 : 1;

    // 5. Prepare tips
    const exerciseTips = Array.isArray(tips)
      ? tips
      : typeof tips === "string" && tips.trim()
      ? [tips.trim()]
      : [];

    // 6. Create exercise
    const exercise = await Exercise.create({
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      difficulty,
      duration: duration.trim(),
      equipment: equipment.trim(),
      muscle: muscle.trim(),
      description: description.trim(),
      tips: exerciseTips,
      videoId: videoId.trim(),
      image: image.trim(),
    });

    // 7. Send response
    res.status(201).json(
      successResponse(
        "Exercise created successfully",
        exercise
      )
    );
  } catch (error) {
    console.error("Create exercise error:", error);

    // Handle MongoDB duplicate key error
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: number }).code === 11000
    ) {
      res.status(409).json(
        errorResponse(
          "Exercise with this ID already exists",
          "DUPLICATE_EXERCISE_ID",
          409
        )
      );

      return;
    }

    res.status(500).json(
      errorResponse(
        "Failed to create exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

/**
 * GET /api/exercises/favorites
 * GET /api/exercises/favorites/:userId
 * Retrieves all favorite/regular exercises saved for the user profile.
 */
export const getFavoriteExercises = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = (req as any).user;
    const paramUserId = req.params.userId;
    const queryUserId = req.query.userId as string | undefined;
    const headerEmail = req.headers["x-user-email"] as string | undefined;

    const targetUserId =
      paramUserId ||
      queryUserId ||
      authUser?.userId ||
      authUser?.id ||
      authUser?._id ||
      headerEmail ||
      authUser?.email;

    if (!targetUserId) {
      return res.status(400).json(
        errorResponse("userId is required to fetch favorite exercises", "VALIDATION_ERROR", 400)
      );
    }

    const cleanUserId = String(targetUserId).trim();

    // 1. Fetch from UserFavoriteExercise collection
    const queryConditions: any[] = [{ userId: cleanUserId }];
    if (headerEmail && headerEmail !== cleanUserId) {
      queryConditions.push({ userId: headerEmail.trim() });
    }
    if (authUser?.email && authUser.email !== cleanUserId) {
      queryConditions.push({ userId: authUser.email.trim() });
    }

    const favoriteEntries = await UserFavoriteExercise.find({
      $or: queryConditions,
    })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Also check User model to ensure sync with Profile database
    let userDoc: any = null;
    if (mongoose.Types.ObjectId.isValid(cleanUserId)) {
      userDoc = await User.findById(cleanUserId)
        .select("_id email favoriteExercises")
        .lean();
    } else if (cleanUserId.includes("@")) {
      userDoc = await User.findOne({ email: cleanUserId.toLowerCase() })
        .select("_id email favoriteExercises")
        .lean();
    } else if (authUser?.email) {
      userDoc = await User.findOne({ email: authUser.email.toLowerCase() })
        .select("_id email favoriteExercises")
        .lean();
    }

    // If User document has favoriteExercise IDs not in favoriteEntries, backfill them
    if (
      userDoc &&
      Array.isArray(userDoc.favoriteExercises) &&
      userDoc.favoriteExercises.length > 0
    ) {
      const existingIds = new Set(
        favoriteEntries.map((e: any) => String(e.exerciseId))
      );
      const missingIds = userDoc.favoriteExercises.filter(
        (id: string) => !existingIds.has(String(id))
      );

      if (missingIds.length > 0) {
        const foundMissing = await Exercise.find({
          $or: [
            {
              _id: {
                $in: missingIds.filter((id: string) =>
                  mongoose.Types.ObjectId.isValid(id)
                ),
              },
            },
            {
              id: {
                $in: missingIds
                  .map(Number)
                  .filter((n: number) => !isNaN(n)),
              },
            },
            { name: { $in: missingIds } },
          ],
        }).lean();

        for (const ex of foundMissing) {
          favoriteEntries.push({
            _id: ex._id,
            userId: String(userDoc._id),
            exerciseId: String(ex._id),
            name: ex.name,
            category: ex.category,
            difficulty: ex.difficulty,
            duration: ex.duration,
            equipment: ex.equipment,
            muscle: ex.muscle,
            description: ex.description,
            tips: ex.tips,
            videoId: ex.videoId,
            image: ex.image,
            createdAt: ex.createdAt,
            updatedAt: ex.updatedAt,
          } as any);
        }
      }
    }

    return res.status(200).json(
      successResponse(
        "Favorite exercises fetched successfully",
        favoriteEntries
      )
    );
  } catch (error) {
    console.error("Get favorite exercises error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to fetch favorite exercises",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

/**
 * POST /api/exercises/favorites/toggle
 * Toggles an exercise in the user's favorites (connected to user profile database).
 */
export const toggleFavoriteExercise = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = (req as any).user;
    const { userId: bodyUserId, exerciseId, exerciseData } = req.body;
    const headerEmail = req.headers["x-user-email"] as string | undefined;

    const targetUserId =
      bodyUserId ||
      authUser?.userId ||
      authUser?.id ||
      authUser?._id ||
      headerEmail ||
      authUser?.email;

    if (!targetUserId) {
      return res.status(401).json(
        errorResponse(
          "Authentication or userId is required to favorite exercises",
          "UNAUTHORIZED",
          401
        )
      );
    }

    if (!exerciseId) {
      return res.status(400).json(
        errorResponse("exerciseId is required", "VALIDATION_ERROR", 400)
      );
    }

    const cleanExerciseId = String(exerciseId).trim();
    const cleanUserId = String(targetUserId).trim();

    // Check if already favorited in UserFavoriteExercise
    const existing = await UserFavoriteExercise.findOne({
      $or: [
        { userId: cleanUserId, exerciseId: cleanExerciseId },
        ...(headerEmail ? [{ userId: headerEmail.trim(), exerciseId: cleanExerciseId }] : []),
        ...(authUser?.email ? [{ userId: authUser.email.trim(), exerciseId: cleanExerciseId }] : []),
      ],
    });

    // Also find User document in Profile database to update favoriteExercises array
    let userFilter: any = null;
    if (mongoose.Types.ObjectId.isValid(cleanUserId)) {
      userFilter = { _id: cleanUserId };
    } else if (cleanUserId.includes("@")) {
      userFilter = { email: cleanUserId.toLowerCase() };
    } else if (authUser?.email) {
      userFilter = { email: authUser.email.toLowerCase() };
    }

    if (existing) {
      // ── UNFAVORITE ──
      await UserFavoriteExercise.deleteMany({
        exerciseId: cleanExerciseId,
        $or: [
          { userId: cleanUserId },
          ...(headerEmail ? [{ userId: headerEmail.trim() }] : []),
          ...(authUser?.email ? [{ userId: authUser.email.trim() }] : []),
        ],
      });

      if (userFilter) {
        await User.updateOne(userFilter, {
          $pull: { favoriteExercises: cleanExerciseId },
        });
      }

      return res.status(200).json(
        successResponse("Exercise removed from favorites", {
          isFavorited: false,
          exerciseId: cleanExerciseId,
        })
      );
    } else {
      // ── FAVORITE ──
      let exData = exerciseData;
      if (!exData || !exData.name) {
        if (mongoose.Types.ObjectId.isValid(cleanExerciseId)) {
          exData = await Exercise.findById(cleanExerciseId).lean();
        } else if (!isNaN(Number(cleanExerciseId))) {
          exData = await Exercise.findOne({ id: Number(cleanExerciseId) }).lean();
        }
      }

      const newFavorite = await UserFavoriteExercise.create({
        userId: cleanUserId,
        exerciseId: cleanExerciseId,
        name: exData?.name || "Exercise",
        category: (exData?.category || "FUNCTIONAL").toUpperCase(),
        difficulty: (exData?.difficulty || "BEGINNER").toUpperCase(),
        duration: exData?.duration || "10 MIN",
        equipment: (exData?.equipment || "BODYWEIGHT").toUpperCase(),
        muscle: (exData?.muscle || "FULL BODY").toUpperCase(),
        description: exData?.description || "",
        tips: Array.isArray(exData?.tips) ? exData.tips : [],
        videoId: exData?.videoId || "",
        image: exData?.image || "",
      });

      // Update User profile document in MongoDB
      if (userFilter) {
        await User.updateOne(userFilter, {
          $addToSet: { favoriteExercises: cleanExerciseId },
        });
      }

      return res.status(201).json(
        successResponse("Exercise added to favorites", {
          isFavorited: true,
          exerciseId: cleanExerciseId,
          exercise: newFavorite,
        })
      );
    }
  } catch (error) {
    console.error("Toggle favorite exercise error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to toggle favorite exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};

/**
 * DELETE /api/exercises/favorites/:exerciseId
 * Removes an exercise from user favorites.
 */
export const removeFavoriteExercise = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const authUser = (req as any).user;
    const { exerciseId } = req.params;
    const queryUserId = (req.query.userId as string) || req.body?.userId;
    const headerEmail = req.headers["x-user-email"] as string | undefined;

    const targetUserId =
      queryUserId ||
      authUser?.userId ||
      authUser?.id ||
      authUser?._id ||
      headerEmail ||
      authUser?.email;

    if (!targetUserId || !exerciseId) {
      return res.status(400).json(
        errorResponse(
          "userId and exerciseId are required",
          "VALIDATION_ERROR",
          400
        )
      );
    }

    const cleanExerciseId = String(exerciseId).trim();
    const cleanUserId = String(targetUserId).trim();

    await UserFavoriteExercise.deleteMany({
      exerciseId: cleanExerciseId,
      $or: [
        { userId: cleanUserId },
        ...(headerEmail ? [{ userId: headerEmail.trim() }] : []),
        ...(authUser?.email ? [{ userId: authUser.email.trim() }] : []),
      ],
    });

    let userFilter: any = null;
    if (mongoose.Types.ObjectId.isValid(cleanUserId)) {
      userFilter = { _id: cleanUserId };
    } else if (cleanUserId.includes("@")) {
      userFilter = { email: cleanUserId.toLowerCase() };
    } else if (authUser?.email) {
      userFilter = { email: authUser.email.toLowerCase() };
    }

    if (userFilter) {
      await User.updateOne(userFilter, {
        $pull: { favoriteExercises: cleanExerciseId },
      });
    }

    return res.status(200).json(
      successResponse("Exercise removed from favorites", {
        exerciseId: cleanExerciseId,
      })
    );
  } catch (error) {
    console.error("Remove favorite exercise error:", error);
    return res.status(500).json(
      errorResponse(
        "Failed to remove favorite exercise",
        error instanceof Error ? error.message : "Unknown error",
        500
      )
    );
  }
};