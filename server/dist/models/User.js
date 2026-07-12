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
}, {
    timestamps: true,
});
const User = mongoose.model("User", UserSchema);
export default User;
