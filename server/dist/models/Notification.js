import mongoose, { Schema } from "mongoose";
const NotificationSchema = new Schema({
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
    type: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    read: {
        type: Boolean,
        default: false,
        index: true,
    },
}, { timestamps: true });
const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
