import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  getStorageData,
  uploadFiles,
  deleteFile,
  createFolder,
  deleteFolder,
} from "../controllers/storageController.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024, files: 20 }, // 100MB per file, matches client MAX_FILE_SIZE_MB
});

const router = express.Router();

router.get("/", protect, getStorageData);
router.post("/upload", protect, upload.array("files", 20), uploadFiles);
router.delete("/:id", protect, deleteFile);

router.post("/folders", protect, createFolder);
router.delete("/folders/:id", protect, deleteFolder);

export default router;
