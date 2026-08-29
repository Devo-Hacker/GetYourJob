import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import connectionsRoutes from "./routes/connectionsRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import storageRoutes from "./routes/storageRoutes.js";
import skillsRoutes from "./routes/skillsRoutes.js";
import skillGapRoutes from "./routes/skillGapRoutes.js";
import jobsRoutes from "./routes/jobsRoutes.js";
 
dotenv.config();
connectDB();
 
const app = express();
 
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());
 
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});
 
app.use("/api/auth", authRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/account", accountRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/skill-gap", skillGapRoutes);
app.use("/api/jobs", jobsRoutes);
 
// Every future feature route gets mounted the same way, e.g.:
// app.use("/api/jobs", jobRoutes);
// app.use("/api/roles", roleRoutes);
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});