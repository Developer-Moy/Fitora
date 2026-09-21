import mongoose, { Document, Schema } from "mongoose";

export type SessionBookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface ISessionBooking extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  trainerId: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  status: SessionBookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const sessionBookingSchema = new Schema<ISessionBooking>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const SessionBooking = mongoose.model<ISessionBooking>(
  "SessionBooking",
  sessionBookingSchema
);

export default SessionBooking;
