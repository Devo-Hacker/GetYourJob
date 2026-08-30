import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getRoadmap,
  createPlaylistItem,
  updatePlaylistItem,
  deletePlaylistItem,
  updateDailyTask,
} from "../controllers/roadmapController.js";

const router = express.Router();

router.get("/", protect, getRoadmap);
router.post("/playlist/item", protect, createPlaylistItem);
router.put("/playlist/item", protect, updatePlaylistItem);
router.delete("/playlist/item/:id", protect, deletePlaylistItem);
router.put("/task", protect, updateDailyTask);

export default router;