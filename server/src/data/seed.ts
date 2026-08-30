import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { WorkoutLog } from "../models/WorkoutLog.model";
import { LOCAL_WORKOUTS_DATABASE } from "./workout.data";

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from .env");
    }

    // Connect MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected");

    // Clear existing data
    await Exercise.deleteMany({});
    await WorkoutLog.deleteMany({});

    console.log("Existing exercise and workout log data cleared");

    // Convert LOCAL_WORKOUTS_DATABASE format
    // to Exercise model format
    const exerciseSeedData = LOCAL_WORKOUTS_DATABASE.map((exercise) => ({
      name: exercise.name,
      description: `${exercise.name} is a ${exercise.difficulty.toLowerCase()} level exercise targeting ${exercise.muscleGroup}.`,

      primaryMuscles: exercise.targetMuscles,

      secondaryMuscles: [],

      equipment: exercise.equipment,

      difficulty: exercise.difficulty,

      instructions: exercise.instructions,

      commonMistakes: [
        "Avoid using excessive momentum.",
        "Maintain proper form throughout the movement.",
        "Use a controlled range of motion.",
      ],

      videoUrl: exercise.videoUrl,

      gifUrl: exercise.imageUrl,
    }));

    // Insert exercises
    const exercises = await Exercise.insertMany(exerciseSeedData);

    console.log(`Seeded ${exercises.length} exercises`);

    // Create workout logs from the exercises
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

    // Insert workout logs
    const workoutLogs = await WorkoutLog.insertMany(
      workoutLogSeedData
    );

    console.log(`Seeded ${workoutLogs.length} workout logs`);

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