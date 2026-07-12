import { createCompany, getCompanyByUser, joinCompanyByCode, listCompanyEmployees, removeEmployeeFromCompany, updateCompany, updateSchedulingSettings, } from "../services/companyService.js";
export async function createCompanyController(req, res) {
    try {
        const { companyName, schedulingSettings } = req.body;
        const company = await createCompany(req.user.id, companyName, schedulingSettings);
        res.status(201).json(company);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function getMyCompanyController(req, res) {
    try {
        const company = await getCompanyByUser(req.user.id);
        res.json(company);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function joinCompanyController(req, res) {
    try {
        const { companyCode } = req.body;
        const company = await joinCompanyByCode(req.user.id, companyCode);
        res.json(company);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function updateCompanyController(req, res) {
    try {
        const company = await updateCompany(req.user.id, req.user.companyId, req.body);
        res.json(company);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function updateCompanySettingsController(req, res) {
    try {
        const company = await updateSchedulingSettings(req.user.id, req.user.companyId, req.body.schedulingSettings);
        res.json(company);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function listCompanyEmployeesController(req, res) {
    try {
        const employees = await listCompanyEmployees(req.user.companyId);
        res.json(employees);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
export async function removeEmployeeController(req, res) {
    try {
        await removeEmployeeFromCompany(req.user.id, req.user.companyId, String(req.params.employeeId));
        res.json({ message: "Employee removed successfully" });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
