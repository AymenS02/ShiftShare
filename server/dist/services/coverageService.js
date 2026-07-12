import CoverageRequest from "../models/CoverageRequest.js";
import Shift from "../models/Shift.js";
import User from "../models/User.js";
import { createAuditLog } from "./auditService.js";
import { createNotification } from "./notificationService.js";
import { claimOpenShift } from "./shiftService.js";
async function ensureSameCompany(userId, companyId) {
    const user = await User.findById(userId).select("companyId");
    return user?.companyId?.toString() === companyId;
}
export async function createCoverageRequest(input) {
    const shift = await Shift.findById(input.shiftId);
    if (!shift || shift.companyId.toString() !== input.companyId) {
        throw new Error("Shift not found");
    }
    if (!shift.employeeId || shift.employeeId.toString() !== input.requesterId) {
        throw new Error("Only assigned employee can request coverage");
    }
    if (input.targetEmployeeId === input.requesterId) {
        throw new Error("Target employee must be different");
    }
    const requesterInCompany = await ensureSameCompany(input.requesterId, input.companyId);
    const targetInCompany = await ensureSameCompany(input.targetEmployeeId, input.companyId);
    if (!requesterInCompany || !targetInCompany) {
        throw new Error("Users must belong to the same company");
    }
    const request = await CoverageRequest.create({
        shiftId: input.shiftId,
        requesterId: input.requesterId,
        targetEmployeeId: input.targetEmployeeId,
        status: "pending",
    });
    await createNotification({
        userId: input.targetEmployeeId,
        companyId: input.companyId,
        type: "COVERAGE_REQUEST",
        message: `You received a coverage request for shift ${shift.date} (${shift.startTime}-${shift.endTime})`,
    });
    await createAuditLog({
        companyId: input.companyId,
        performedBy: input.requesterId,
        action: "CREATE_COVERAGE_REQUEST",
        targetType: "CoverageRequest",
        targetId: request._id.toString(),
        newData: request.toObject(),
    });
    return request;
}
export async function listCoverageRequestsForUser(userId) {
    return await CoverageRequest.find({
        $or: [{ requesterId: userId }, { targetEmployeeId: userId }],
    })
        .populate("shiftId")
        .sort({ createdAt: -1 });
}
export async function respondCoverageRequest(input) {
    const request = await CoverageRequest.findById(input.requestId);
    if (!request) {
        throw new Error("Coverage request not found");
    }
    if (request.targetEmployeeId.toString() !== input.targetEmployeeId) {
        throw new Error("Only target employee can respond");
    }
    if (request.status !== "pending") {
        throw new Error("Coverage request already resolved");
    }
    if (input.action === "declined") {
        request.status = "declined";
        await request.save();
    }
    else {
        await claimOpenShift(request.shiftId.toString(), input.targetEmployeeId, input.companyId).catch(async () => {
            const shift = await Shift.findById(request.shiftId);
            if (!shift)
                throw new Error("Shift not found");
            shift.employeeId = input.targetEmployeeId;
            shift.status = "claimed";
            await shift.save();
        });
        const shift = await Shift.findById(request.shiftId);
        if (!shift) {
            throw new Error("Shift not found");
        }
        shift.employeeId = input.targetEmployeeId;
        shift.status = "claimed";
        await shift.save();
        request.status = "accepted";
        await request.save();
        await createNotification({
            userId: request.requesterId.toString(),
            companyId: input.companyId,
            type: "COVERAGE_ACCEPTED",
            message: "Your coverage request was accepted",
        });
    }
    await createAuditLog({
        companyId: input.companyId,
        performedBy: input.targetEmployeeId,
        action: input.action === "accepted" ? "SHIFT_TRANSFER" : "DECLINE_COVERAGE_REQUEST",
        targetType: "CoverageRequest",
        targetId: request._id.toString(),
        newData: request.toObject(),
    });
    return request;
}
