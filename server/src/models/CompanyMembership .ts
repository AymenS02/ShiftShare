import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyMembership extends Document {
  userId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  role: "employee" | "manager";
  createdAt: Date;
}

const CompanyMembershipSchema = new Schema<ICompanyMembership>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "manager"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CompanyMembership = mongoose.model<ICompanyMembership>("CompanyMembership",CompanyMembershipSchema);

export default CompanyMembership;