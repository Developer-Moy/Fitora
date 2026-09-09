import mongoose, { Document, Schema } from "mongoose";

export type NotificationType =
  | "payment"
  | "renewal"
  | "system"
  | "invoice"
  | "upgrade"
  | "alert";

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["payment", "renewal", "system", "invoice", "upgrade", "alert"],
      default: "system",
    },
    link: {
      type: String,
      required: false,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default Notification;
