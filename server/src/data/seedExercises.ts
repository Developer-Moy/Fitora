import "dotenv/config";
import mongoose from "mongoose";
import { Exercise } from "../models/Exercise.model";
import { EXERCISE_DATABASE } from "./exercise.data";

const MONGODB_URI = process.env.MONGODB_URI;

async function seedExercisesOnly() {
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");
  
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB for exercise seeding");
  
  await Exercise.deleteMany({});
  console.log("Cleared existing exercises");
  
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
  
  await mongoose.disconnect();
}

seedExercisesOnly().catch(console.error);
