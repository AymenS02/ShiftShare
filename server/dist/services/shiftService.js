import Company from "../models/Company.js";
import Shift from "../models/Shift.js";
import User from "../models/User.js";
import AvailabilityPreference from "../models/AvailabilityPreference.js";
import { createAuditLog } from "./auditService.js";
import { createNotification } from "./notificationService.js";
function toMinutes(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}
function overlaps(aStart, aEnd, bStart, bEnd) {
    return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd);
}
function getDayName(dateString) {
    const day = new Date(`${dateString}T00:00:00.000Z`).getUTCDay();
    const days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
    ];
    return days[day];
}
async function validateShiftAssignmentRules(input) {
    const employee = await User.findById(input.employeeId).select("companyId role");
    if (!employee || employee.role !== "employee") {
        throw new Error("Employee not found");
    }
    if (employee.companyId?.toString() !== input.companyId) {
        throw new Error("Employee does not belong to this company");
    }
    const existingShifts = await Shift.find({
        companyId: input.companyId,
        employeeId: input.employeeId,
        date: input.date,
        status: { $in: ["scheduled", "claimed"] },
        ...(input.shiftIdToIgnore ? { _id: { $ne: input.shiftIdToIgnore } } : {}),
    });
    for (const shift of existingShifts) {
        if (overlaps(input.startTime, input.endTime, shift.startTime, shift.endTime)) {
            throw new Error("Employee already has an overlapping shift");
        }
    }
    const availability = await AvailabilityPreference.findOne({
        companyId: input.companyId,
        userId: input.employeeId,
    });
    if (availability) {
        if (availability.hasNoUsualShifts) {
            throw new Error("Employee has no usual shifts and cannot be auto-assigned");
        }
        const dayName = getDayName(input.date);
        const dayRanges = availability.weeklyAvailability[dayName] ?? [];
        const allowed = dayRanges.some((range) => toMinutes(range.startTime) <= toMinutes(input.startTime) &&
            toMinutes(range.endTime) >= toMinutes(input.endTime));
        if (!allowed) {
            throw new Error("Employee availability does not allow this shift");
        }
    }
}
async function validateDailyLimit(input) {
    const company = await Company.findById(input.companyId).select("schedulingSettings");
    if (!company) {
        throw new Error("Company not found");
    }
    const dayName = getDayName(input.date);
    const limit = company.schedulingSettings?.[dayName] ?? 0;
    const activeShifts = await Shift.countDocuments({
        companyId: input.companyId,
        date: input.date,
        status: { $in: ["scheduled", "claimed"] },
        ...(input.shiftIdToIgnore ? { _id: { $ne: input.shiftIdToIgnore } } : {}),
    });
    if (activeShifts >= limit) {
        throw new Error(`Daily worker limit reached for ${dayName}`);
    }
}
export async function createShift(input) {
    if (toMinutes(input.startTime) >= toMinutes(input.endTime)) {
        throw new Error("Shift startTime must be before endTime");
    }
    const status = input.status ?? (input.employeeId ? "scheduled" : "open");
    if (input.employeeId) {
        await validateDailyLimit({ companyId: input.companyId, date: input.date });
        await validateShiftAssignmentRules({
            companyId: input.companyId,
            employeeId: input.employeeId,
            date: input.date,
            startTime: input.startTime,
            endTime: input.endTime,
        });
    }
    const shift = await Shift.create({
        companyId: input.companyId,
        employeeId: input.employeeId ?? null,
        date: input.date,
        startTime: input.startTime,
        endTime: input.endTime,
        createdBy: input.performedBy,
        status,
    });
    await createAuditLog({
        companyId: input.companyId,
        performedBy: input.performedBy,
        action: "CREATE_SHIFT",
        targetType: "Shift",
        targetId: shift._id.toString(),
        newData: shift.toObject(),
    });
    if (shift.status === "open") {
        const employees = await User.find({
            companyId: input.companyId,
            role: "employee",
        }).select("_id");
        await Promise.all(employees.map((employee) => createNotification({
            userId: employee._id.toString(),
            companyId: input.companyId,
            type: "NEW_OPEN_SHIFT",
            message: `Open shift available on ${input.date} (${input.startTime}-${input.endTime})`,
        })));
    }
    return shift;
}
export async function updateShift(shiftId, performedBy, companyId, payload) {
    const shift = await Shift.findById(shiftId);
    if (!shift || shift.companyId.toString() !== companyId) {
        throw new Error("Shift not found");
    }
    const previousData = shift.toObject();
    if (payload.date)
        shift.date = payload.date;
    if (payload.startTime)
        shift.startTime = payload.startTime;
    if (payload.endTime)
        shift.endTime = payload.endTime;
    if (payload.status)
        shift.status = payload.status;
    if (payload.employeeId !== undefined) {
        shift.employeeId = payload.employeeId ? payload.employeeId : null;
    }
    if (shift.employeeId) {
        await validateDailyLimit({
            companyId,
            date: shift.date,
            shiftIdToIgnore: shiftId,
        });
        await validateShiftAssignmentRules({
            companyId,
            employeeId: shift.employeeId.toString(),
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            shiftIdToIgnore: shiftId,
        });
    }
    await shift.save();
    await createAuditLog({
        companyId,
        performedBy,
        action: "UPDATE_SHIFT",
        targetType: "Shift",
        targetId: shiftId,
        previousData,
        newData: shift.toObject(),
    });
    return shift;
}
export async function listShifts(companyId, options) {
    const query = { companyId };
    if (options?.mineOnly) {
        query.employeeId = options.mineOnly;
    }
    return await Shift.find(query).sort({ date: 1, startTime: 1 });
}
export async function listOpenShifts(companyId) {
    return await Shift.find({
        companyId,
        status: "open",
    }).sort({ date: 1, startTime: 1 });
}
export async function generateSchedule(input) {
    const company = await Company.findById(input.companyId).select("schedulingSettings");
    if (!company) {
        throw new Error("Company not found");
    }
    const users = await User.find({
        companyId: input.companyId,
        role: "employee",
    }).select("_id");
    const availabilityDocs = await AvailabilityPreference.find({
        companyId: input.companyId,
        userId: { $in: users.map((u) => u._id) },
    });
    const availabilityByUser = new Map(availabilityDocs.map((doc) => [doc.userId.toString(), doc]));
    const created = [];
    const start = new Date(`${input.startDate}T00:00:00.000Z`);
    const end = new Date(`${input.endDate}T00:00:00.000Z`);
    for (let dt = new Date(start); dt <= end; dt.setUTCDate(dt.getUTCDate() + 1)) {
        const date = dt.toISOString().split("T")[0];
        const dayName = getDayName(date);
        const limit = company.schedulingSettings[dayName] ?? 0;
        let assignedCount = 0;
        for (const user of users) {
            if (assignedCount >= limit)
                break;
            const availability = availabilityByUser.get(user._id.toString());
            if (!availability || availability.hasNoUsualShifts) {
                continue;
            }
            const dayAvailability = availability.weeklyAvailability[dayName] ?? [];
            const isAvailable = dayAvailability.some((range) => toMinutes(range.startTime) <= toMinutes(input.startTime) &&
                toMinutes(range.endTime) >= toMinutes(input.endTime));
            if (!isAvailable)
                continue;
            const conflict = await Shift.findOne({
                companyId: input.companyId,
                employeeId: user._id,
                date,
                status: { $in: ["scheduled", "claimed"] },
            });
            if (conflict && overlaps(input.startTime, input.endTime, conflict.startTime, conflict.endTime)) {
                continue;
            }
            const shift = await Shift.create({
                companyId: input.companyId,
                employeeId: user._id,
                date,
                startTime: input.startTime,
                endTime: input.endTime,
                createdBy: input.managerId,
                status: "scheduled",
            });
            created.push(shift);
            assignedCount += 1;
        }
        while (assignedCount < limit) {
            const openShift = await Shift.create({
                companyId: input.companyId,
                employeeId: null,
                date,
                startTime: input.startTime,
                endTime: input.endTime,
                createdBy: input.managerId,
                status: "open",
            });
            created.push(openShift);
            assignedCount += 1;
        }
    }
    await createAuditLog({
        companyId: input.companyId,
        performedBy: input.managerId,
        action: "GENERATE_SCHEDULE",
        targetType: "Shift",
        targetId: input.companyId,
        newData: {
            count: created.length,
            startDate: input.startDate,
            endDate: input.endDate,
            startTime: input.startTime,
            endTime: input.endTime,
        },
    });
    return created;
}
export async function releaseShiftEmergency(shiftId, requesterId, companyId) {
    const shift = await Shift.findById(shiftId);
    if (!shift || shift.companyId.toString() !== companyId) {
        throw new Error("Shift not found");
    }
    if (!shift.employeeId || shift.employeeId.toString() !== requesterId) {
        throw new Error("You can only release your own assigned shift");
    }
    const previousData = shift.toObject();
    shift.employeeId = null;
    shift.status = "open";
    await shift.save();
    await createAuditLog({
        companyId,
        performedBy: requesterId,
        action: "EMERGENCY_SHIFT_RELEASE",
        targetType: "Shift",
        targetId: shiftId,
        previousData,
        newData: shift.toObject(),
    });
    const employees = await User.find({
        companyId,
        role: "employee",
        _id: { $ne: requesterId },
    }).select("_id");
    await Promise.all(employees.map((employee) => createNotification({
        userId: employee._id.toString(),
        companyId,
        type: "EMERGENCY_OPEN_SHIFT",
        message: `Emergency open shift: ${shift.date} (${shift.startTime}-${shift.endTime})`,
    })));
    const managers = await User.find({ companyId, role: "manager" }).select("_id");
    await Promise.all(managers.map((manager) => createNotification({
        userId: manager._id.toString(),
        companyId,
        type: "EMERGENCY_ABSENCE",
        message: `Emergency absence reported for shift ${shift.date} (${shift.startTime}-${shift.endTime})`,
    })));
    return shift;
}
export async function claimOpenShift(shiftId, employeeId, companyId) {
    const shift = await Shift.findById(shiftId);
    if (!shift || shift.companyId.toString() !== companyId) {
        throw new Error("Shift not found");
    }
    if (shift.status !== "open") {
        throw new Error("Only open shifts can be claimed");
    }
    await validateDailyLimit({
        companyId,
        date: shift.date,
        shiftIdToIgnore: shiftId,
    });
    await validateShiftAssignmentRules({
        companyId,
        employeeId,
        date: shift.date,
        startTime: shift.startTime,
        endTime: shift.endTime,
        shiftIdToIgnore: shiftId,
    });
    const previousData = shift.toObject();
    shift.employeeId = employeeId;
    shift.status = "claimed";
    await shift.save();
    await createAuditLog({
        companyId,
        performedBy: employeeId,
        action: "CLAIM_OPEN_SHIFT",
        targetType: "Shift",
        targetId: shiftId,
        previousData,
        newData: shift.toObject(),
    });
    return shift;
}
