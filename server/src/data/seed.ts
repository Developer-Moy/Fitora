import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { WorkoutLog } from "../models/WorkoutLog.model";
import { LOCAL_WORKOUTS_DATABASE } from "./workout.data";
import { EXERCISE_DATABASE } from "./exercise.data";

import BMIHistory from "../models/BMIHistory.model";
import Goal from "../models/Goal.model";

// Alfaaz Ahmed Task Imports
import Branch from "../models/Branch.model";
import User from "../models/User.model";

import branches from "./branches.json";
import usersData from "./users.json";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
}

// --------------------------------------------------
// Types
// --------------------------------------------------

type Gender = "male" | "female";

type GoalType = "Bulking" | "Cutting" | "Recomp" | "Maintenance";

interface Profile {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  activityLevel: number;
  goalType: GoalType;
}

// --------------------------------------------------
// BMI
// --------------------------------------------------

const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;

  return Number((weight / (heightInMeters * heightInMeters)).toFixed(2));
};

// --------------------------------------------------
// BMR - Mifflin-St Jeor
// --------------------------------------------------

const calculateBMR = (
  age: number,
  gender: Gender,
  height: number,
  weight: number,
): number => {
  if (gender === "male") {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  }

  return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
};

// --------------------------------------------------
// TDEE
// --------------------------------------------------

const calculateTDEE = (bmr: number, activityLevel: number): number => {
  return Math.round(bmr * activityLevel);
};

// --------------------------------------------------
// BMI Category
// --------------------------------------------------

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Normal";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
};

// --------------------------------------------------
// Risk Level
// --------------------------------------------------

const getRiskLevel = (bmi: number): string => {
  if (bmi < 18.5) {
    return "Moderate";
  }

  if (bmi < 25) {
    return "Low";
  }

  if (bmi < 30) {
    return "Moderate";
  }

  return "High";
};

// --------------------------------------------------
// Ideal Weight
// BMI 18.5 - 24.9
// --------------------------------------------------

const getIdealWeightRange = (height: number) => {
  const heightInMeters = height / 100;

  const min = 18.5 * heightInMeters * heightInMeters;

  const max = 24.9 * heightInMeters * heightInMeters;

  return {
    min: Number(min.toFixed(1)),
    max: Number(max.toFixed(1)),
  };
};

// --------------------------------------------------
// Calories
// --------------------------------------------------

const calculateTargetCalories = (tdee: number, goalType: GoalType): number => {
  switch (goalType) {
    case "Bulking":
      return Math.round(tdee * 1.1);

    case "Cutting":
      return Math.round(tdee * 0.8);

    case "Recomp":
      return Math.round(tdee * 0.95);

    case "Maintenance":
      return tdee;
  }
};

// --------------------------------------------------
// Macros
// --------------------------------------------------

const calculateMacros = (
  weight: number,
  calories: number,
  goalType: GoalType,
) => {
  let protein: number;
  let fat: number;

  switch (goalType) {
    case "Bulking":
      protein = Math.round(weight * 2);
      fat = Math.round(weight * 0.9);
      break;

    case "Cutting":
      protein = Math.round(weight * 2);
      fat = Math.round(weight * 0.7);
      break;

    case "Recomp":
      protein = Math.round(weight * 2);
      fat = Math.round(weight * 0.8);
      break;

    case "Maintenance":
      protein = Math.round(weight * 1.8);
      fat = Math.round(weight * 0.8);
      break;
  }

  const proteinCalories = protein * 4;
  const fatCalories = fat * 9;

  const carbs = Math.max(
    0,
    Math.round((calories - proteinCalories - fatCalories) / 4),
  );

  return {
    protein,
    carbs,
    fat,
  };
};

// --------------------------------------------------
// 50 Realistic Profiles
// --------------------------------------------------

const profiles: Profile[] = [
  {
    age: 24,
    gender: "male",
    height: 170,
    weight: 68,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 26,
    gender: "female",
    height: 160,
    weight: 58,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 29,
    gender: "male",
    height: 178,
    weight: 76,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 23,
    gender: "female",
    height: 165,
    weight: 55,
    activityLevel: 1.55,
    goalType: "Cutting",
  },
  {
    age: 31,
    gender: "male",
    height: 180,
    weight: 84,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 28,
    gender: "female",
    height: 168,
    weight: 64,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 22,
    gender: "male",
    height: 175,
    weight: 70,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 30,
    gender: "female",
    height: 162,
    weight: 72,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 35,
    gender: "male",
    height: 172,
    weight: 78,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 25,
    gender: "female",
    height: 158,
    weight: 52,
    activityLevel: 1.55,
    goalType: "Bulking",
  },
  {
    age: 27,
    gender: "male",
    height: 182,
    weight: 88,
    activityLevel: 1.55,
    goalType: "Cutting",
  },
  {
    age: 34,
    gender: "female",
    height: 170,
    weight: 76,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 40,
    gender: "male",
    height: 176,
    weight: 92,
    activityLevel: 1.375,
    goalType: "Maintenance",
  },
  {
    age: 29,
    gender: "female",
    height: 164,
    weight: 61,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 26,
    gender: "male",
    height: 168,
    weight: 63,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 32,
    gender: "female",
    height: 166,
    weight: 69,
    activityLevel: 1.375,
    goalType: "Maintenance",
  },
  {
    age: 23,
    gender: "male",
    height: 180,
    weight: 74,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 27,
    gender: "female",
    height: 160,
    weight: 67,
    activityLevel: 1.55,
    goalType: "Cutting",
  },
  {
    age: 33,
    gender: "male",
    height: 174,
    weight: 81,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 24,
    gender: "female",
    height: 167,
    weight: 59,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 30,
    gender: "male",
    height: 185,
    weight: 96,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 36,
    gender: "female",
    height: 163,
    weight: 82,
    activityLevel: 1.2,
    goalType: "Cutting",
  },
  {
    age: 28,
    gender: "male",
    height: 177,
    weight: 73,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 31,
    gender: "female",
    height: 169,
    weight: 66,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 25,
    gender: "male",
    height: 171,
    weight: 57,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 22,
    gender: "female",
    height: 157,
    weight: 48,
    activityLevel: 1.55,
    goalType: "Bulking",
  },
  {
    age: 37,
    gender: "male",
    height: 179,
    weight: 86,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 40,
    gender: "female",
    height: 165,
    weight: 74,
    activityLevel: 1.375,
    goalType: "Maintenance",
  },
  {
    age: 32,
    gender: "male",
    height: 183,
    weight: 90,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 26,
    gender: "female",
    height: 161,
    weight: 56,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 21,
    gender: "male",
    height: 169,
    weight: 60,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 33,
    gender: "female",
    height: 171,
    weight: 79,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 38,
    gender: "male",
    height: 175,
    weight: 101,
    activityLevel: 1.2,
    goalType: "Cutting",
  },
  {
    age: 28,
    gender: "female",
    height: 159,
    weight: 62,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 34,
    gender: "male",
    height: 181,
    weight: 83,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 25,
    gender: "female",
    height: 166,
    weight: 60,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 29,
    gender: "male",
    height: 173,
    weight: 69,
    activityLevel: 1.725,
    goalType: "Recomp",
  },
  {
    age: 35,
    gender: "female",
    height: 168,
    weight: 73,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 42,
    gender: "male",
    height: 177,
    weight: 95,
    activityLevel: 1.2,
    goalType: "Maintenance",
  },
  {
    age: 30,
    gender: "female",
    height: 163,
    weight: 58,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 24,
    gender: "male",
    height: 186,
    weight: 82,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 27,
    gender: "female",
    height: 170,
    weight: 70,
    activityLevel: 1.55,
    goalType: "Cutting",
  },
  {
    age: 36,
    gender: "male",
    height: 170,
    weight: 85,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
  {
    age: 38,
    gender: "female",
    height: 162,
    weight: 77,
    activityLevel: 1.2,
    goalType: "Maintenance",
  },
  {
    age: 27,
    gender: "male",
    height: 176,
    weight: 79,
    activityLevel: 1.55,
    goalType: "Recomp",
  },
  {
    age: 23,
    gender: "female",
    height: 159,
    weight: 51,
    activityLevel: 1.725,
    goalType: "Bulking",
  },
  {
    age: 31,
    gender: "male",
    height: 184,
    weight: 91,
    activityLevel: 1.55,
    goalType: "Cutting",
  },
  {
    age: 29,
    gender: "female",
    height: 167,
    weight: 63,
    activityLevel: 1.55,
    goalType: "Maintenance",
  },
  {
    age: 26,
    gender: "male",
    height: 172,
    weight: 66,
    activityLevel: 1.725,
    goalType: "Recomp",
  },
  {
    age: 34,
    gender: "female",
    height: 160,
    weight: 68,
    activityLevel: 1.375,
    goalType: "Cutting",
  },
];

// --------------------------------------------------
// Seed Database
// --------------------------------------------------

const seedDatabase = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log(`MongoDB connected: ${mongoose.connection.host}`);

    // Get existing users
    const users = await mongoose.connection
      .collection("users")
      .find({})
      .project({ _id: 1 })
      .limit(50)
      .toArray();

    if (users.length === 0) {
      throw new Error("No users found in users collection.");
    }

    // -----------------------------
    // Seed Branches, Users, Exercises & Workouts
    // -----------------------------
    await Branch.deleteMany({});
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await WorkoutLog.deleteMany({});

    const insertedBranches = await Branch.insertMany(branches);
    console.log(`Inserted ${insertedBranches.length} branches.`);

    const insertedUsers = await User.insertMany(usersData);
    console.log(`Inserted ${insertedUsers.length} users.`);

    // Seed Exercises
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
    console.log(`Inserted ${exercises.length} exercises.`);

    // Seed Workout Logs
    const workoutLogSeedData = LOCAL_WORKOUTS_DATABASE.map(
      (exercise, index) => ({
        userId: users[index % users.length]._id.toString(),
        exerciseName: exercise.name,
        setsCount: exercise.targetSets || 3,
        repsCount: exercise.targetReps || 10,
        durationMinutes: 30,
        caloriesBurned: exercise.estimatedCaloriesBurn || 150,
        date: new Date().toISOString(),
      }),
    );
    const workoutLogs = await WorkoutLog.insertMany(workoutLogSeedData);
    console.log(`Inserted ${workoutLogs.length} workout logs.`);

    // ------------------------------------------------
    // Create BMI History records
    // ------------------------------------------------
    const bmiHistories = profiles.map((profile, index) => {
      const bmi = calculateBMI(profile.weight, profile.height);
      const bmr = calculateBMR(
        profile.age,
        profile.gender,
        profile.height,
        profile.weight,
      );
      const tdee = calculateTDEE(bmr, profile.activityLevel);
      const targetCalories = calculateTargetCalories(tdee, profile.goalType);
      const macros = calculateMacros(
        profile.weight,
        targetCalories,
        profile.goalType,
      );
      const idealWeightRange = getIdealWeightRange(profile.height);

      return {
        userId: users[index % users.length]._id,
        age: profile.age,
        gender: profile.gender,
        height: profile.height,
        weight: profile.weight,
        bmi,
        bmr,
        tdee,
        targetCalories,
        macros,
        bmiCategory: getBMICategory(bmi),
        riskLevel: getRiskLevel(bmi),
        idealWeightRange,
      };
    });

    // ------------------------------------------------
    // Create Goal records
    // ------------------------------------------------

    const goals = profiles.map((profile, index) => {
      const bmr = calculateBMR(
        profile.age,
        profile.gender,
        profile.height,
        profile.weight,
      );

      const tdee = calculateTDEE(bmr, profile.activityLevel);

      const targetCalories = calculateTargetCalories(tdee, profile.goalType);

      const macros = calculateMacros(
        profile.weight,
        targetCalories,
        profile.goalType,
      );

      let targetWeight = profile.weight;

      if (profile.goalType === "Bulking") {
        targetWeight = Number((profile.weight * 1.05).toFixed(1));
      }

      if (profile.goalType === "Cutting") {
        targetWeight = Number((profile.weight * 0.95).toFixed(1));
      }

      if (profile.goalType === "Recomp") {
        targetWeight = Number(profile.weight.toFixed(1));
      }

      if (profile.goalType === "Maintenance") {
        targetWeight = Number(profile.weight.toFixed(1));
      }

      return {
        userId: users[index % users.length]._id.toString(),

        goalType: profile.goalType,

        targetWeight,

        weeklyWorkoutFrequency: 3 + (index % 4),

        bmr,

        tdee,

        targetCalories,

        macros,
      };
    });

    // ------------------------------------------------
    // Insert data
    // ------------------------------------------------

    const insertedBMI = await BMIHistory.insertMany(bmiHistories);

    console.log(`Inserted ${insertedBMI.length} BMI history records.`);

    const insertedGoals = await Goal.insertMany(goals);

    console.log(`Inserted ${insertedGoals.length} goal records.`);

    console.log("SEED COMPLETED SUCCESSFULLY");

    console.log(`BMI Histories: ${insertedBMI.length}`);

    // =========================
    // SUCCESS
    // =========================

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Seed failed:", error);

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log("MongoDB connection closed.");
  }
};

seedDatabase();
