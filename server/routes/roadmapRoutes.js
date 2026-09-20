import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoadmap,
  createPlaylistItem,
  updatePlaylistItem,
  deletePlaylistItem,
  addDailyTask,
  updateDailyTask,
  deleteDailyTask,
  updateStreak,
  toggleWeeklyDay,
  addWeeklyTask,
  updateWeeklyTask,
  deleteWeeklyTask,
  addMilestone,
  updateMilestone,
  deleteMilestone,
  updateRoadmapStats,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/", protect, getRoadmap);

// Playlists
router.post("/playlist/item", protect, createPlaylistItem);
router.put("/playlist/item", protect, updatePlaylistItem);
router.delete("/playlist/item/:id", protect, deletePlaylistItem);

// Daily Goal
router.post("/daily-task", protect, addDailyTask);
router.put("/daily-task", protect, updateDailyTask);
router.delete("/daily-task/:taskId", protect, deleteDailyTask);
router.put("/streak", protect, updateStreak);

// Weekly Goal
router.put("/weekly-day", protect, toggleWeeklyDay);
router.post("/weekly-task", protect, addWeeklyTask);
router.put("/weekly-task", protect, updateWeeklyTask);
router.delete("/weekly-task/:taskId", protect, deleteWeeklyTask);

// Milestones
router.post("/milestone", protect, addMilestone);
router.put("/milestone", protect, updateMilestone);
router.delete("/milestone/:milestoneId", protect, deleteMilestone);

// Stats & Role
router.put("/stats", protect, updateRoadmapStats);

export default router;