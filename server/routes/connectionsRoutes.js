import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  saveConnection,
  updateManualStats,
  getConnections,
  deleteConnection,
} from "../controllers/connectionsController.js";

const router = express.Router();

router.get("/", protect, getConnections);
router.post("/", protect, saveConnection);
router.put("/:platform/stats", protect, updateManualStats);
router.delete("/:platform", protect, deleteConnection);

export default router;
