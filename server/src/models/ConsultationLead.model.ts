import mongoose, { Document, Schema } from "mongoose";

export type ConsultationLeadStatus = "new" | "contacted" | "enrolled";

export interface IConsultationLead extends Document {
    fullName: string;
    email: string;
    phone?: string;
    selectedClass?: string;
    comment?: string;
    branchId: string;
    status: ConsultationLeadStatus;
    createdAt?: Date;
    updatedAt?: Date;
}

const consultationLeadSchema = new Schema<IConsultationLead>(
    {
        fullName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, trim: true, default: "" },
        selectedClass: { type: String, trim: true, default: "" },
        comment: { type: String, trim: true, default: "" },
        branchId: { type: String, required: true, index: true, trim: true },
        status: { type: String, enum: ["new", "contacted", "enrolled"], default: "new", index: true },
    },
    { timestamps: true },
);

consultationLeadSchema.index({ branchId: 1, status: 1, createdAt: -1 });

export const ConsultationLead = mongoose.model<IConsultationLead>("ConsultationLead", consultationLeadSchema);
export default ConsultationLead;