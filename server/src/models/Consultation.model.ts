import mongoose, { Document, Schema } from "mongoose";

export type ConsultationStatus =
  | "pending"
  | "contacted"
  | "enrolled"
  | "archived";

export interface IConsultation extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone?: string;
  selectedClass?: string;
  preferredBranch?: string;
  preferredProgram?: string;
  comment?: string;
  status: ConsultationStatus;
  notes?: string;
  assignedStaffId?: mongoose.Types.ObjectId;
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
      trim: true,
      default: "General Fitness & Gym Access",
    },
    preferredBranch: {
      type: String,
      trim: true,
      default: "Dhaka - Gulshan-2 Branch (Flagship)",
    },
    preferredProgram: {
      type: String,
      trim: true,
      default: "Standard Gym Membership",
    },
    comment: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "contacted", "enrolled", "archived"],
      default: "pending",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    assignedStaffId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

consultationSchema.index({ createdAt: -1 });
consultationSchema.index({ email: 1 });
consultationSchema.index({ status: 1 });

export const Consultation = mongoose.model<IConsultation>(
  "Consultation",
  consultationSchema,
);

export default Consultation;
