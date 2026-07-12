import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import shiftRoutes from "./routes/shiftRoutes.js";
import coverageRoutes from "./routes/coverageRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import auditRoutes from "./routes/auditRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("ShiftShare API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/shifts", shiftRoutes);
app.use("/api/coverage", coverageRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/audit", auditRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});