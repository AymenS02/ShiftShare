import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema({
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
    role: {
        type: String,
        enum: ["employee", "manager"],
        default: "employee",
    },
    companyId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        default: null,
        index: true,
    },
}, {
    timestamps: true,
});
const User = mongoose.model("User", UserSchema);
export default User;
