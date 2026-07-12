import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyId: mongoose.Types.ObjectId;
  role: "employee" | "manager";
  createdAt: Date;
}


const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    companyId: {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },

    role: {
      type: String,
      enum: ["employee", "manager"],
      default: "employee",
    },
  },
  {
    timestamps: true,
  }
);


const User = mongoose.model<IUser>("User", UserSchema);

export default User;