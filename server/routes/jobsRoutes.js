import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getJobs, getJobStats, saveJob, applyJob } from "../controllers/jobsController.js";

const router = express.Router();

router.get("/", protect, getJobs);
router.get("/stats", protect, getJobStats);
router.post("/:externalId/save", protect, saveJob);
router.post("/:externalId/apply", protect, applyJob);

export default router;
