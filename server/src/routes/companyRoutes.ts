import { Router } from "express";
import { createCompanyController, getMyCompanyController} from "../controllers/companyController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", authMiddleware, createCompanyController);

router.get("/my-company", authMiddleware, getMyCompanyController);

export default router;