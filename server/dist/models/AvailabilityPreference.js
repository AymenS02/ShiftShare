import mongoose, { Schema } from "mongoose";
const TimeRangeSchema = new Schema({
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true,
    },
}, { _id: false });
const AvailabilityPreferenceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
        index: true,
    },
    hasNoUsualShifts: {
        type: Boolean,
        default: false,
    },
    weeklyAvailability: {
        monday: {
            type: [TimeRangeSchema],
            default: [],
        },
        tuesday: {
            type: [TimeRangeSchema],
            default: [],
        },
        wednesday: {
            type: [TimeRangeSchema],
            default: [],
        },
        thursday: {
            type: [TimeRangeSchema],
            default: [],
        },
        friday: {
            type: [TimeRangeSchema],
            default: [],
        },
        saturday: {
            type: [TimeRangeSchema],
            default: [],
        },
        sunday: {
            type: [TimeRangeSchema],
            default: [],
        },
    },
}, {
    timestamps: true,
});
AvailabilityPreferenceSchema.index({ userId: 1, companyId: 1 }, { unique: true });
const AvailabilityPreference = mongoose.model("AvailabilityPreference", AvailabilityPreferenceSchema);
export default AvailabilityPreference;
