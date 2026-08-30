import mongoose, { Document, Schema } from "mongoose";

export type BranchDivision =
  | "Dhaka"
  | "Chittagong"
  | "Rajshahi"
  | "Khulna"
  | "Barishal"
  | "Sylhet"
  | "Rangpur"
  | "Mymensingh";

export type BranchStatus = "active" | "maintenance" | "upcoming";

export interface IBranch extends Document {
  _id: mongoose.Types.ObjectId;

  // Basic Information
  name: string;
  slug: string;
  division: BranchDivision;
  district: string;
  city: string;
  address: string;
  postalCode: string;

  // Contact
  phone: string;
  email: string;

  // Branch Manager
  adminName: string;

  // Location
  coordinates: {
    lat: number;
    lng: number;
  };

  // Gym Information
  facilities: string[];
  membershipPlans: {
    basic: number;
    standard: number;
    premium: number;
  };

  trainerCount: number;
  memberCapacity: number;

  operatingHours: {
    open: string;
    close: string;
  };

  image: string;

  // Status
  status: BranchStatus;

  createdAt: Date;
  updatedAt: Date;
}

const branchSchema = new Schema<IBranch>(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    division: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chittagong",
        "Rajshahi",
        "Khulna",
        "Barishal",
        "Sylhet",
        "Rangpur",
        "Mymensingh",
      ],
    },
    district: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      required: true,
      trim: true,
    },

    // Contact
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },

    // Branch Manager
    adminName: {
      type: String,
      trim: true,
      default: "Branch Operations Manager",
    },

    // Coordinates
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    // Gym Facilities
    facilities: {
      type: [String],
      required: true,
      default: [],
    },

    // Membership Plans
    membershipPlans: {
      basic: {
        type: Number,
        required: true,
      },
      standard: {
        type: Number,
        required: true,
      },
      premium: {
        type: Number,
        required: true,
      },
    },

    // Capacity & Trainers
    trainerCount: {
      type: Number,
      required: true,
    },
    memberCapacity: {
      type: Number,
      required: true,
    },

    // Operating Hours
    operatingHours: {
      open: {
        type: String,
        required: true,
      },
      close: {
        type: String,
        required: true,
      },
    },

    // Branch Image
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Status
    status: {
      type: String,
      required: true,
      enum: ["active", "maintenance", "upcoming"],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
branchSchema.index({ division: 1 });
branchSchema.index({ district: 1 });
branchSchema.index({ city: 1 });
branchSchema.index({ slug: 1 });
branchSchema.index({ status: 1 });

const Branch = mongoose.model<IBranch>("Branch", branchSchema);

export default Branch;