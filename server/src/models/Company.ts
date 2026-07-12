import mongoose, { Document, Schema } from "mongoose";

type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type SchedulingSettings = Record<DayName, number>;

export interface ICompany extends Document {
  companyName: string;
  companyCode: string;
  managerId: mongoose.Types.ObjectId;
  employees: mongoose.Types.ObjectId[];
  schedulingSettings: SchedulingSettings;
  createdAt: Date;
  updatedAt: Date;
}

const defaultSchedulingSettings: SchedulingSettings = {
  monday: 0,
  tuesday: 0,
  wednesday: 0,
  thursday: 0,
  friday: 0,
  saturday: 0,
  sunday: 0,
};

const CompanySchema = new Schema<ICompany>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    managerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    schedulingSettings: {
      type: Object,
      default: defaultSchedulingSettings,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;

