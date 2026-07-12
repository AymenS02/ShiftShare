import mongoose, { Document, Schema } from "mongoose";

export interface IAuditLog extends Document {
  companyId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  action: string;
  targetType: string;
  targetId: mongoose.Types.ObjectId | string;
  previousData: unknown;
  newData: unknown;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      immutable: true,
      index: true,
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      immutable: true,
      trim: true,
    },
    targetId: {
      type: Schema.Types.Mixed,
      required: true,
      immutable: true,
    },
    previousData: {
      type: Schema.Types.Mixed,
      default: null,
      immutable: true,
    },
    newData: {
      type: Schema.Types.Mixed,
      default: null,
      immutable: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },
  },
  { timestamps: true }
);

const AuditLog = mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;

