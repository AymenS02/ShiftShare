import mongoose, { Document, Schema } from "mongoose";

export type CoverageRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled";

export interface ICoverageRequest extends Document {
  shiftId: mongoose.Types.ObjectId;
  requesterId: mongoose.Types.ObjectId;
  targetEmployeeId: mongoose.Types.ObjectId;
  status: CoverageRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const CoverageRequestSchema = new Schema<ICoverageRequest>(
  {
    shiftId: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
      index: true,
    },
    requesterId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

const CoverageRequest = mongoose.model<ICoverageRequest>(
  "CoverageRequest",
  CoverageRequestSchema
);

export default CoverageRequest;

