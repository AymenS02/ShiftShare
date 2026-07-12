import AvailabilityPreference from "../models/AvailabilityPreference.js";
import User from "../models/User.js";
import { createAuditLog } from "./auditService.js";
function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
function validateRange(range) {
    if (!/^\d{2}:\d{2}$/.test(range.startTime) || !/^\d{2}:\d{2}$/.test(range.endTime)) {
        throw new Error("Invalid time format, expected HH:mm");
    }
    if (toMinutes(range.startTime) >= toMinutes(range.endTime)) {
        throw new Error("Availability time ranges must have start < end");
    }
}
function validateNoOverlap(ranges) {
    const sorted = [...ranges].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime));
    for (let i = 1; i < sorted.length; i += 1) {
        if (toMinutes(sorted[i].startTime) < toMinutes(sorted[i - 1].endTime)) {
            throw new Error("Availability ranges cannot overlap");
        }
    }
}
export async function upsertAvailabilityPreference(userId, hasNoUsualShifts, weeklyAvailability) {
    const user = await User.findById(userId).select("companyId");
    if (!user || !user.companyId) {
        throw new Error("User must belong to a company");
    }
    Object.values(weeklyAvailability).forEach((ranges) => {
        ranges.forEach(validateRange);
        validateNoOverlap(ranges);
    });
    const existing = await AvailabilityPreference.findOne({
        userId,
        companyId: user.companyId,
    });
    const previousData = existing ? existing.toObject() : null;
    const updated = await AvailabilityPreference.findOneAndUpdate({ userId, companyId: user.companyId }, {
        userId,
        companyId: user.companyId,
        hasNoUsualShifts,
        weeklyAvailability,
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    await createAuditLog({
        companyId: user.companyId.toString(),
        performedBy: userId,
        action: existing ? "UPDATE_AVAILABILITY" : "CREATE_AVAILABILITY",
        targetType: "AvailabilityPreference",
        targetId: updated._id.toString(),
        previousData,
        newData: updated.toObject(),
    });
    return updated;
}
export async function getAvailabilityPreference(userId) {
    const user = await User.findById(userId).select("companyId");
    if (!user || !user.companyId) {
        throw new Error("User must belong to a company");
    }
    return await AvailabilityPreference.findOne({
        userId,
        companyId: user.companyId,
    });
}
