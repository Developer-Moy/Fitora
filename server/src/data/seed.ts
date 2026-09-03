import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { WorkoutLog } from "../models/WorkoutLog.model";
import { LOCAL_WORKOUTS_DATABASE } from "./workout.data";
import { EXERCISE_DATABASE } from "./exercise.data";

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    // =========================
    // CONNECT TO MONGODB
    // =========================

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // =========================
    // CLEAR EXISTING DATA
    // =========================

    await Exercise.deleteMany({});
    await WorkoutLog.deleteMany({});

    console.log("Existing exercise and workout log data cleared");

    // =========================
    // SEED EXERCISES
    // =========================

    const exerciseSeedData = EXERCISE_DATABASE.map((exercise) => ({
      id: exercise.id,
      name: exercise.name,
      category: exercise.category,
      difficulty: exercise.difficulty,
      duration: exercise.duration,
      equipment: exercise.equipment,
      muscle: exercise.muscle,
      description: exercise.description,
      tips: exercise.tips,
      videoId: exercise.videoId,
      image: exercise.image,
    }));

    const exercises = await Exercise.insertMany(exerciseSeedData);

    console.log(`Seeded ${exercises.length} exercises`);

    // =========================
    // SEED WORKOUT LOGS
    // =========================

    const workoutLogSeedData = LOCAL_WORKOUTS_DATABASE.map(
      (exercise, index) => ({
        userId: "guest_user",

        exerciseName: exercise.name,

        setsCount: exercise.targetSets,

        repsCount: exercise.targetReps,

        weight: 0,

        durationMinutes: 10,

        caloriesBurned: exercise.estimatedCaloriesBurn,

        notes: exercise.tips,

        date: new Date(
          Date.now() - index * 24 * 60 * 60 * 1000
        ),
      })
    );

    const workoutLogs = await WorkoutLog.insertMany(
      workoutLogSeedData
    );

    console.log(`Seeded ${workoutLogs.length} workout logs`);

    // =========================
    // SUCCESS
    // =========================

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Seed failed:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  }
}

seed();