import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getSkillBoard, updateDesiredSkills } from "../controllers/skillsController.js";

const router = express.Router();

router.get("/board", protect, getSkillBoard);
router.put("/desired", protect, updateDesiredSkills);

export default router;
