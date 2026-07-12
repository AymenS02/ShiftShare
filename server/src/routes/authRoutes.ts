import { Router } from "express";
import { getProfile, login, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/logout", (req, res) => {
  res.status(200).json({
    message: "Logout successful",
  });
});

router.get(
 "/profile",
 authMiddleware,
 getProfile
);

export default router;