import mongoose, { Schema } from "mongoose";
const ShiftSchema = new Schema({
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    },
    date: {
        type: String,
        required: true,
        index: true,
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["scheduled", "open", "claimed", "cancelled", "completed"],
        default: "scheduled",
        index: true,
    },
}, { timestamps: true });
ShiftSchema.index({ companyId: 1, employeeId: 1, date: 1, startTime: 1, endTime: 1 }, { name: "shift_lookup_idx" });
const Shift = mongoose.model("Shift", ShiftSchema);
export default Shift;
