import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import {
  getStorageData,
  uploadFiles,
  viewFile,
  updateFile,
  deleteFile,
  createFolder,
  getFolderTree,
  updateFolder,
  deleteFolder,
  searchStorage,
} from "../controllers/storageController.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 100 * 1024 * 1024, files: 20 }, // 100MB per file, matches client MAX_FILE_SIZE_MB
});

const router = express.Router();

router.get("/", protect, getStorageData);
router.get("/search", protect, searchStorage);
router.post("/upload", protect, upload.array("files", 20), uploadFiles);

router.get("/:id/view", protect, viewFile);
router.patch("/:id", protect, updateFile);
router.delete("/:id", protect, deleteFile);

router.post("/folders", protect, createFolder);
router.get("/folders/tree", protect, getFolderTree);
router.patch("/folders/:id", protect, updateFolder);
router.delete("/folders/:id", protect, deleteFolder);

export default router;