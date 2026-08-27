import mongoose, { Document, Schema } from "mongoose";

export interface IConsultation extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  selectedClass: string;
  preferredBranch?: string;
  preferredProgram?: string;
  comment?: string;
  status: "pending" | "contacted" | "enrolled" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
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
    selectedClass: {
      type: String,
      default: "General Fitness & Gym Access",
    },
    preferredBranch: {
      type: String,
      default: "Dhaka - Gulshan-2 Branch (Flagship)",
    },
    preferredProgram: {
      type: String,
      default: "Standard Membership",
    },
    comment: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "enrolled", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

consultationSchema.index({ email: 1 });
consultationSchema.index({ status: 1 });

export const Consultation =
  mongoose.models.Consultation ||
  mongoose.model<IConsultation>("Consultation", consultationSchema);

export default Consultation;
