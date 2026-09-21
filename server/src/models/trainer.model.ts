import mongoose, { Document, Schema } from "mongoose";

export type TrainerStatus = "active" | "inactive";

export interface IAvailabilitySlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface ITrainer extends Document {
  _id: mongoose.Types.ObjectId;

  // Basic Info
  name: string;
  email: string;
  slug: string;
  designation: string;
  bio: string;
  about: string;
  philosophy?: string;
  earlyLife?: string;
  careerHighlights?: string[];

  // Images
  photo: string;
  coverImage?: string;

  // Professional Information
  experienceYears: number;
  specializations: string[];
  certifications: string[];
  achievements: string[];
  education: string[];
  languages: string[];

  // Social Links
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;

  // Branch Information
  branchId?: mongoose.Types.ObjectId;
  branchName?: string;
  city?: string;

  // Availability
  availability: IAvailabilitySlot[];

  // Status
  featured: boolean;
  status: TrainerStatus;

  // Ratings
  rating: number;
  totalReviews: number;

  createdAt: Date;
  updatedAt: Date;
}

const availabilitySlotSchema = new Schema<IAvailabilitySlot>(
  {
    day: {
      type: String,
      required: true,
      trim: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const trainerSchema = new Schema<ITrainer>(
  {
    // Basic Info
    name: {
      type: String,
      required: [true, "Trainer name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Trainer slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    designation: {
      type: String,
      required: [true, "Trainer designation is required"],
      trim: true,
    },
    bio: {
      type: String,
      required: [true, "Trainer bio is required"],
      trim: true,
    },
    about: {
      type: String,
      required: [true, "Trainer about section is required"],
      trim: true,
    },
    philosophy: {
      type: String,
      trim: true,
      default: "",
    },
    earlyLife: {
      type: String,
      trim: true,
      default: "",
    },
    careerHighlights: {
      type: [String],
      default: [],
    },

    // Images
    photo: {
      type: String,
      required: [true, "Trainer photo is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },

    // Professional Information
    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: [0, "Experience years cannot be negative"],
    },
    specializations: {
      type: [String],
      default: [],
    },
    certifications: {
      type: [String],
      default: [],
    },
    achievements: {
      type: [String],
      default: [],
    },
    education: {
      type: [String],
      default: [],
    },
    languages: {
      type: [String],
      default: [],
    },

    // Social Links
    facebook: {
      type: String,
      trim: true,
      default: "",
    },
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    youtube: {
      type: String,
      trim: true,
      default: "",
    },

    // Branch Information
    branchId: {
      type: mongoose.Types.ObjectId,
      ref: "Branch",
      default: null,
    },
    branchName: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },

    // Availability
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },

    // Status
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message: "{VALUE} is not supported",
      },
      default: "active",
    },

    // Ratings
    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be greater than 5"],
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: [0, "Total reviews cannot be negative"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Indexes
// NOTE: `slug` already gets a unique index from the `unique: true` option on the
// field definition above; declaring it again here caused a duplicate-index warning.
trainerSchema.index({ name: 1 });
trainerSchema.index({ status: 1 });
trainerSchema.index({ featured: 1 });

const Trainer = mongoose.model<ITrainer>("Trainer", trainerSchema);

export { Trainer };
export default Trainer;
