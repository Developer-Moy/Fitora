import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
    actorId: string;
    action: string;
    targetId: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        actorId: { type: String, required: true, index: true },
        action: { type: String, required: true },
        targetId: { type: String, required: true, index: true },
        metadata: { type: Schema.Types.Mixed },
    },
    { timestamps: { createdAt: true, updatedAt: false } },
);

export const AuditLog = mongoose.model<IAuditLog>("AuditLog", auditLogSchema);
export default AuditLog;