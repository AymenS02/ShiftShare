import Company from "../models/Company.js";
import User from "../models/User.js";
import { createAuditLog } from "./auditService.js";
function generateCompanyCode(length = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < length; i += 1) {
        code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
}
async function createUniqueCompanyCode() {
    for (let i = 0; i < 20; i += 1) {
        const code = generateCompanyCode();
        const exists = await Company.exists({ companyCode: code });
        if (!exists) {
            return code;
        }
    }
    throw new Error("Failed to generate unique company code");
}
export async function createCompany(managerId, companyName, schedulingSettings) {
    const manager = await User.findById(managerId);
    if (!manager) {
        throw new Error("Manager not found");
    }
    if (manager.role !== "manager") {
        throw new Error("Only managers can create companies");
    }
    if (manager.companyId) {
        throw new Error("Manager already belongs to a company");
    }
    const companyCode = await createUniqueCompanyCode();
    const company = await Company.create({
        companyName,
        companyCode,
        managerId,
        employees: [],
        schedulingSettings: schedulingSettings ?? undefined,
    });
    manager.companyId = company._id;
    await manager.save();
    await createAuditLog({
        companyId: company._id.toString(),
        performedBy: managerId,
        action: "CREATE_COMPANY",
        targetType: "Company",
        targetId: company._id.toString(),
        newData: company.toObject(),
    });
    return company;
}
export async function getCompanyByUser(userId) {
    const user = await User.findById(userId).select("companyId role");
    if (!user || !user.companyId) {
        throw new Error("User does not belong to a company");
    }
    const company = await Company.findById(user.companyId).populate("managerId", "firstName lastName email role");
    if (!company) {
        throw new Error("Company not found");
    }
    return company;
}
export async function joinCompanyByCode(userId, companyCode) {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role !== "employee") {
        throw new Error("Only employees can join by company code");
    }
    if (user.companyId) {
        throw new Error("User already belongs to a company");
    }
    const code = companyCode.trim().toUpperCase();
    const company = await Company.findOne({ companyCode: code });
    if (!company) {
        throw new Error("Invalid company code");
    }
    user.companyId = company._id;
    await user.save();
    if (!company.employees.some((id) => id.toString() === userId)) {
        company.employees.push(user._id);
        await company.save();
    }
    await createAuditLog({
        companyId: company._id.toString(),
        performedBy: userId,
        action: "EMPLOYEE_JOIN_COMPANY",
        targetType: "User",
        targetId: userId,
        newData: { companyId: company._id.toString() },
    });
    return company;
}
export async function updateCompany(managerId, companyId, payload) {
    const company = await Company.findById(companyId);
    if (!company) {
        throw new Error("Company not found");
    }
    if (company.managerId.toString() !== managerId) {
        throw new Error("Forbidden");
    }
    const previousData = company.toObject();
    if (payload.companyName) {
        company.companyName = payload.companyName.trim();
    }
    if (payload.companyCode) {
        const normalizedCode = payload.companyCode.trim().toUpperCase();
        const exists = await Company.exists({
            companyCode: normalizedCode,
            _id: { $ne: companyId },
        });
        if (exists) {
            throw new Error("Company code already exists");
        }
        company.companyCode = normalizedCode;
    }
    await company.save();
    await createAuditLog({
        companyId,
        performedBy: managerId,
        action: "UPDATE_COMPANY",
        targetType: "Company",
        targetId: companyId,
        previousData,
        newData: company.toObject(),
    });
    return company;
}
export async function updateSchedulingSettings(managerId, companyId, schedulingSettings) {
    const company = await Company.findById(companyId);
    if (!company) {
        throw new Error("Company not found");
    }
    if (company.managerId.toString() !== managerId) {
        throw new Error("Forbidden");
    }
    const previousData = company.schedulingSettings;
    company.schedulingSettings = schedulingSettings;
    await company.save();
    await createAuditLog({
        companyId,
        performedBy: managerId,
        action: "UPDATE_COMPANY_SETTINGS",
        targetType: "Company",
        targetId: companyId,
        previousData,
        newData: schedulingSettings,
    });
    return company;
}
export async function listCompanyEmployees(companyId) {
    return await User.find({ companyId }).select("-password").sort({ createdAt: 1 });
}
export async function removeEmployeeFromCompany(managerId, companyId, employeeId) {
    const company = await Company.findById(companyId);
    if (!company) {
        throw new Error("Company not found");
    }
    if (company.managerId.toString() !== managerId) {
        throw new Error("Forbidden");
    }
    const employee = await User.findById(employeeId);
    if (!employee) {
        throw new Error("Employee not found");
    }
    if (employee.role !== "employee") {
        throw new Error("Only employees can be removed");
    }
    if (employee.companyId?.toString() !== companyId) {
        throw new Error("Employee does not belong to this company");
    }
    const previousData = { companyId: employee.companyId?.toString() ?? null };
    employee.companyId = null;
    await employee.save();
    company.employees = company.employees.filter((id) => id.toString() !== employeeId);
    await company.save();
    await createAuditLog({
        companyId,
        performedBy: managerId,
        action: "REMOVE_EMPLOYEE",
        targetType: "User",
        targetId: employeeId,
        previousData,
        newData: { companyId: null },
    });
}
