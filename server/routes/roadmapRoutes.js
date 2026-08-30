import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoadmap,
  createPlaylistFolder,
  addVideoToPlaylist,
  updateFolderProgress,
  updateDailyTask,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/", protect, getRoadmap);
router.post("/playlist", protect, createPlaylistFolder);
router.post("/playlist/video", protect, addVideoToPlaylist);
router.put("/playlist/progress", protect, updateFolderProgress);
router.put("/task", protect, updateDailyTask);

export default router;