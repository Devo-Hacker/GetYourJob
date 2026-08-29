import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { getProjects, createProject, deleteProject } from "../controllers/projectsController.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
});

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, upload.single("file"), createProject);
router.delete("/:id", protect, deleteProject);

export default router;
