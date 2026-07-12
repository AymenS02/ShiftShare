import mongoose, { Document, Schema } from "mongoose";

export interface ITimeRange {
  startTime: string;
  endTime: string;
}

export interface IAvailabilityPreference extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  hasNoUsualShifts: boolean;
  weeklyAvailability: Record<string, ITimeRange[]>;
  createdAt: Date;
  updatedAt: Date;
}

const TimeRangeSchema = new Schema<ITimeRange>(
  {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const AvailabilityPreferenceSchema = new Schema<IAvailabilityPreference>(
  {
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
  },
  {
    timestamps: true,
  }
);

AvailabilityPreferenceSchema.index({ userId: 1, companyId: 1 }, { unique: true });

const AvailabilityPreference = mongoose.model<IAvailabilityPreference>(
  "AvailabilityPreference",
  AvailabilityPreferenceSchema
);

export default AvailabilityPreference;
