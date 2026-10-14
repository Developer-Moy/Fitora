import mongoose, { Document, Schema } from "mongoose";

export interface IUserFavoriteExercise extends Document {
  userId: string;
  exerciseId: string;
  name: string;
  category: string;
  difficulty: string;
  duration: string;
  equipment: string;
  muscle: string;
  description: string;
  tips: string[];
  videoId: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserFavoriteExerciseSchema = new Schema<IUserFavoriteExercise>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    exerciseId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      default: "BEGINNER",
    },
    duration: {
      type: String,
      required: true,
      default: "10 MIN",
    },
    equipment: {
      type: String,
      required: true,
      default: "BODYWEIGHT",
    },
    muscle: {
      type: String,
      required: true,
      default: "FULL BODY",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    tips: {
      type: [String],
      required: false,
      default: [],
    },
    videoId: {
      type: String,
      required: false,
      default: "",
    },
    image: {
      type: String,
      required: false,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "userfavoriteexercises",
  }
);

// Compound index to ensure uniqueness per user & exercise
UserFavoriteExerciseSchema.index({ userId: 1, exerciseId: 1 }, { unique: true });

export const UserFavoriteExercise =
  mongoose.models.UserFavoriteExercise ||
  mongoose.model<IUserFavoriteExercise>(
    "UserFavoriteExercise",
    UserFavoriteExerciseSchema
  );

export default UserFavoriteExercise;
