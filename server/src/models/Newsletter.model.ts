import mongoose, { Document, Schema } from "mongoose";

export interface INewsletter extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  status: "subscribed" | "unsubscribed";
  source: "footer" | "checkout" | "homepage_modal";
  createdAt: Date;
  updatedAt: Date;
}

const newsletterSchema = new Schema<INewsletter>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
    source: {
      type: String,
      enum: ["footer", "checkout", "homepage_modal"],
      default: "footer",
    },
  },
  {
    timestamps: true,
  },
);

newsletterSchema.index({ email: 1 });
newsletterSchema.index({ status: 1 });

export const Newsletter =
  mongoose.models.Newsletter ||
  mongoose.model<INewsletter>("Newsletter", newsletterSchema);

export default Newsletter;
