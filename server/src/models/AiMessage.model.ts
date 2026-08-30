import mongoose, { Schema, Document } from "mongoose";

export interface IAiMessage extends Document {
  userId?: mongoose.Types.ObjectId;
  sessionId?: string;
  mode: "chat" | "coach";
  promptText: string;
  responseText: string;
  sender: "user" | "ai" | "system";
  createdAt: Date;
  updatedAt: Date;
}

const AiMessageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    sessionId: {
      type: String,
      default: () =>
        `SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      index: true,
    },
    mode: {
      type: String,
      enum: ["chat", "coach"],
      default: "chat",
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
  },
);

AiMessageSchema.index({ createdAt: -1 });

export const AiMessage = mongoose.model<IAiMessage>(
  "AiMessage",
  AiMessageSchema,
);
export default AiMessage;
