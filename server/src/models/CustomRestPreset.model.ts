import mongoose, { Document, Schema } from "mongoose";

export interface ICustomRestPreset extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const customRestPresetSchema = new Schema<ICustomRestPreset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 3600,
    },
  },
  {
    timestamps: true,
  }
);

customRestPresetSchema.index({ userId: 1, createdAt: -1 });

export const CustomRestPreset = mongoose.model<ICustomRestPreset>(
  "CustomRestPreset",
  customRestPresetSchema
);
export default CustomRestPreset;
