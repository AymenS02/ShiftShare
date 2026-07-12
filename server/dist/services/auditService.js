import AuditLog from "../models/AuditLog.js";
export async function createAuditLog(input) {
    return await AuditLog.create({
        companyId: input.companyId,
        performedBy: input.performedBy,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        previousData: input.previousData ?? null,
        newData: input.newData ?? null,
        timestamp: new Date(),
    });
}
export async function listCompanyAuditLogs(companyId) {
    return await AuditLog.find({ companyId })
        .sort({ timestamp: -1 })
        .populate("performedBy", "firstName lastName email role");
}
