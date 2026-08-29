import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSkillGap, listRoles } from "../controllers/skillGapController.js";

const router = express.Router();

router.get("/", protect, getSkillGap);
router.get("/roles", protect, listRoles);

export default router;
