import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  requireCompanyMembership,
  requireManagerOwnCompany,
  requireRole,
} from "../middleware/authorization.js";
import {
  createCompanyController,
  getMyCompanyController,
  joinCompanyController,
  listCompanyEmployeesController,
  removeEmployeeController,
  updateCompanyController,
  updateCompanySettingsController,
} from "../controllers/companyController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", requireRole(["manager"]), createCompanyController);
router.post("/join", requireRole(["employee"]), joinCompanyController);
router.get("/me", requireCompanyMembership(), getMyCompanyController);
router.patch(
  "/me",
  requireCompanyMembership(),
  requireManagerOwnCompany,
  updateCompanyController
);
router.patch(
  "/me/settings",
  requireCompanyMembership(),
  requireManagerOwnCompany,
  updateCompanySettingsController
);
router.get(
  "/me/employees",
  requireCompanyMembership(),
  requireManagerOwnCompany,
  listCompanyEmployeesController
);
router.delete(
  "/me/employees/:employeeId",
  requireCompanyMembership(),
  requireManagerOwnCompany,
  removeEmployeeController
);

export default router;

