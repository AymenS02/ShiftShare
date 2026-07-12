import mongoose, { Schema } from "mongoose";
const defaultSchedulingSettings = {
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    sunday: 0,
};
const CompanySchema = new Schema({
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
}, {
    timestamps: true,
});
const Company = mongoose.model("Company", CompanySchema);
export default Company;
