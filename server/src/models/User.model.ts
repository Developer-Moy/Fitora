import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
}

const userSchema = newSchema<IUser>(
  {
    name: {
      type: string,
      required: true,
      trim: true,
    },
    email: {
      type: string,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: string,
      required: true,
    },
    role: {
      type: string,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("user", userSchema);