import "dotenv/config";
import mongoose from "mongoose";

import BMIHistory from "../models/BMIHistory.model";
import Goal from "../models/Goal.model";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env");
};

// --------------------------------------------------
// BMI calculation
// --------------------------------------------------
const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;

  return Number(
    (weight / (heightInMeters * heightInMeters)).toFixed(2)
  );
};

// --------------------------------------------------
// BMR - Mifflin-St Jeor
// --------------------------------------------------
const calculateBMR = (
  age: number,
  gender: "male" | "female",
  height: number,
  weight: number
): number => {
  if (gender === "male") {
    return Math.round(
      10 * weight +
        6.25 * height -
        5 * age +
        5
    );
  }

  return Math.round(
    10 * weight +
      6.25 * height -
      5 * age -
      161
  );
};

// --------------------------------------------------
// TDEE
// --------------------------------------------------
const calculateTDEE = (
  bmr: number,
  activityLevel: number
): number => {
  return Math.round(bmr * activityLevel);
};

// --------------------------------------------------
// BMI category
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
// Risk level
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
// Ideal weight range
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
// Seed
// --------------------------------------------------
const seedDatabase = async (): Promise<void> => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI);

    console.log(
      `MongoDB connected: ${mongoose.connection.host}`
    );

    // ------------------------------------------------
    // Get existing users
    // ------------------------------------------------
    const users = await mongoose.connection
      .collection("users")
      .find({})
      .project({ _id: 1 })
      .limit(20)
      .toArray();

    if (users.length === 0) {
      throw new Error(
        "No users found. Create users before running the seed script."
      );
    }

    console.log(`Found ${users.length} existing users.`);

    // ------------------------------------------------
    // BMI seed profiles
    // ------------------------------------------------
    const profiles = [
      // Underweight
      {
        age: 21,
        gender: "male" as const,
        height: 172,
        weight: 52,
        activity: 1.375,
      },
      {
        age: 24,
        gender: "female" as const,
        height: 160,
        weight: 46,
        activity: 1.375,
      },
      {
        age: 27,
        gender: "male" as const,
        height: 178,
        weight: 55,
        activity: 1.55,
      },
      {
        age: 22,
        gender: "female" as const,
        height: 165,
        weight: 49,
        activity: 1.2,
      },
      {
        age: 29,
        gender: "male" as const,
        height: 180,
        weight: 58,
        activity: 1.55,
      },
      {
        age: 25,
        gender: "female" as const,
        height: 158,
        weight: 45,
        activity: 1.375,
      },
      {
        age: 31,
        gender: "male" as const,
        height: 175,
        weight: 54,
        activity: 1.55,
      },
      {
        age: 23,
        gender: "female" as const,
        height: 162,
        weight: 47,
        activity: 1.2,
      },
      {
        age: 28,
        gender: "male" as const,
        height: 170,
        weight: 51,
        activity: 1.375,
      },
      {
        age: 26,
        gender: "female" as const,
        height: 168,
        weight: 50,
        activity: 1.55,
      },

      // Normal
      {
        age: 24,
        gender: "male" as const,
        height: 170,
        weight: 68,
        activity: 1.55,
      },
      {
        age: 26,
        gender: "female" as const,
        height: 160,
        weight: 58,
        activity: 1.375,
      },
      {
        age: 30,
        gender: "male" as const,
        height: 175,
        weight: 72,
        activity: 1.55,
      },
      {
        age: 28,
        gender: "female" as const,
        height: 165,
        weight: 61,
        activity: 1.55,
      },
      {
        age: 32,
        gender: "male" as const,
        height: 180,
        weight: 78,
        activity: 1.725,
      },
      {
        age: 25,
        gender: "female" as const,
        height: 158,
        weight: 55,
        activity: 1.375,
      },
      {
        age: 29,
        gender: "male" as const,
        height: 168,
        weight: 64,
        activity: 1.55,
      },
      {
        age: 27,
        gender: "female" as const,
        height: 170,
        weight: 67,
        activity: 1.55,
      },
      {
        age: 35,
        gender: "male" as const,
        height: 176,
        weight: 74,
        activity: 1.375,
      },
      {
        age: 33,
        gender: "female" as const,
        height: 163,
        weight: 60,
        activity: 1.55,
      },

      // Overweight
      {
        age: 30,
        gender: "male" as const,
        height: 175,
        weight: 84,
        activity: 1.375,
      },
      {
        age: 34,
        gender: "female" as const,
        height: 162,
        weight: 76,
        activity: 1.2,
      },
      {
        age: 38,
        gender: "male" as const,
        height: 180,
        weight: 94,
        activity: 1.375,
      },
      {
        age: 31,
        gender: "female" as const,
        height: 165,
        weight: 79,
        activity: 1.375,
      },
      {
        age: 42,
        gender: "male" as const,
        height: 172,
        weight: 86,
        activity: 1.2,
      },
      {
        age: 36,
        gender: "female" as const,
        height: 168,
        weight: 82,
        activity: 1.375,
      },
      {
        age: 29,
        gender: "male" as const,
        height: 178,
        weight: 88,
        activity: 1.55,
      },
      {
        age: 40,
        gender: "female" as const,
        height: 160,
        weight: 78,
        activity: 1.2,
      },
      {
        age: 37,
        gender: "male" as const,
        height: 183,
        weight: 98,
        activity: 1.375,
      },
      {
        age: 35,
        gender: "female" as const,
        height: 170,
        weight: 86,
        activity: 1.375,
      },

      // Obese
      {
        age: 40,
        gender: "male" as const,
        height: 175,
        weight: 105,
        activity: 1.2,
      },
      {
        age: 44,
        gender: "female" as const,
        height: 165,
        weight: 98,
        activity: 1.2,
      },
      {
        age: 39,
        gender: "male" as const,
        height: 180,
        weight: 112,
        activity: 1.2,
      },
      {
        age: 46,
        gender: "female" as const,
        height: 160,
        weight: 94,
        activity: 1.2,
      },
      {
        age: 42,
        gender: "male" as const,
        height: 172,
        weight: 108,
        activity: 1.375,
      },
      {
        age: 48,
        gender: "female" as const,
        height: 168,
        weight: 101,
        activity: 1.2,
      },
      {
        age: 37,
        gender: "male" as const,
        height: 185,
        weight: 118,
        activity: 1.375,
      },
      {
        age: 45,
        gender: "female" as const,
        height: 162,
        weight: 97,
        activity: 1.2,
      },
      {
        age: 41,
        gender: "male" as const,
        height: 178,
        weight: 115,
        activity: 1.2,
      },
      {
        age: 43,
        gender: "female" as const,
        height: 170,
        weight: 108,
        activity: 1.2,
      },

      // Athletic / Muscle Gain
      {
        age: 22,
        gender: "male" as const,
        height: 178,
        weight: 82,
        activity: 1.725,
      },
      {
        age: 25,
        gender: "male" as const,
        height: 182,
        weight: 88,
        activity: 1.725,
      },
      {
        age: 28,
        gender: "female" as const,
        height: 168,
        weight: 68,
        activity: 1.725,
      },
      {
        age: 24,
        gender: "male" as const,
        height: 175,
        weight: 80,
        activity: 1.9,
      },
      {
        age: 30,
        gender: "female" as const,
        height: 165,
        weight: 65,
        activity: 1.725,
      },
      {
        age: 27,
        gender: "male" as const,
        height: 180,
        weight: 85,
        activity: 1.725,
      },
      {
        age: 23,
        gender: "female" as const,
        height: 170,
        weight: 70,
        activity: 1.725,
      },
      {
        age: 31,
        gender: "male" as const,
        height: 185,
        weight: 92,
        activity: 1.725,
      },
      {
        age: 26,
        gender: "male" as const,
        height: 176,
        weight: 79,
        activity: 1.9,
      },
      {
        age: 29,
        gender: "female" as const,
        height: 168,
        weight: 69,
        activity: 1.725,
      },
    ];

    // ------------------------------------------------
    // Generate BMI histories
    // ------------------------------------------------
    const bmiHistories = profiles.map((profile, index) => {
      const bmi = calculateBMI(
        profile.weight,
        profile.height
      );

      const bmr = calculateBMR(
        profile.age,
        profile.gender,
        profile.height,
        profile.weight
      );

      const tdee = calculateTDEE(
        bmr,
        profile.activity
      );

      const idealWeightRange =
        getIdealWeightRange(profile.height);

      return {
        userId: users[index % users.length]._id,

        age: profile.age,

        gender: profile.gender,

        height: profile.height,

        weight: profile.weight,

        bmi,

        bmr,

        tdee,

        bmiCategory: getBMICategory(bmi),

        riskLevel: getRiskLevel(bmi),

        idealWeightRange,
      };
    });

    // ------------------------------------------------
    // Generate Goals
    // ------------------------------------------------
    const goals = profiles.map((profile, index) => {
      const bmi = calculateBMI(
        profile.weight,
        profile.height
      );

      let targetWeight: number;

      if (bmi < 18.5) {
        // gradual weight gain target
        targetWeight = Number(
          (profile.weight + 4).toFixed(1)
        );
      } else if (bmi < 25) {
        // maintenance / small performance goal
        targetWeight = Number(
          profile.weight.toFixed(1)
        );
      } else {
        // gradual weight reduction target
        targetWeight = Number(
          (profile.weight - 5).toFixed(1)
        );
      }

      const weeklyWorkoutFrequency =
        3 + (index % 4);

      return {
        userId: users[index % users.length]._id.toString(),

        targetWeight,

        weeklyWorkoutFrequency,
      };
    });

    // ------------------------------------------------
    // Insert BMI histories
    // ------------------------------------------------
    const insertedBMI =
      await BMIHistory.insertMany(
        bmiHistories
      );

    console.log(
      `Inserted ${insertedBMI.length} BMI history records.`
    );

    // ------------------------------------------------
    // Insert goals
    // ------------------------------------------------
    const insertedGoals =
      await Goal.insertMany(goals);

    console.log(
      `Inserted ${insertedGoals.length} goal records.`
    );

    console.log(
      "========================================"
    );

    console.log(
      "Seed completed successfully!"
    );

    console.log(
      `BMI Histories: ${insertedBMI.length}`
    );

    console.log(
      `Goals: ${insertedGoals.length}`
    );

    console.log(
      "========================================"
    );
  } catch (error) {
    console.error(
      "Seed failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );
  }
};

seedDatabase();