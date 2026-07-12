import { listCompanyAuditLogs } from "../services/auditService.js";
export async function listAuditLogsController(req, res) {
    try {
        const logs = await listCompanyAuditLogs(req.user.companyId);
        res.json(logs);
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : "Server error" });
    }
}
