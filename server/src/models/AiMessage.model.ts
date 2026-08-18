import mongoose, { Schema, Document } from "mongoose";

export interface IAiMessage extends Document {
  userId: mongoose.Types.ObjectId;
  promptText: string;
  responseText: string;
  sender: "user" | "ai" | "system";
  createdAt?: Date;
  updatedAt?: Date;
}

const AiMessageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    promptText: {
      type: String,
      required: true,
      trim: true,
    },
    responseText: {
      type: String,
      required: true,
      trim: true,
    },
    sender: {
      type: String,
      enum: ["user", "ai", "system"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const AiMessage = mongoose.model<IAiMessage>("AiMessage", AiMessageSchema);
export default AiMessage;
