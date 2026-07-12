import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";

import { connectDB } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("ShiftShare API Running");
});

app.use("/api/auth", authRoutes);

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});