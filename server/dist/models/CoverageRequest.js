import mongoose, { Schema } from "mongoose";
const CoverageRequestSchema = new Schema({
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
}, { timestamps: true });
const CoverageRequest = mongoose.model("CoverageRequest", CoverageRequestSchema);
export default CoverageRequest;
