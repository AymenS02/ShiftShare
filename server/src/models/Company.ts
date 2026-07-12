import mongoose, { Schema, Document } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  owner: mongoose.Types.ObjectId;
  companyCode: string;
  createdAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;