import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { uploadResume, getProfile, setTargetRole } from "../controllers/resumeController.js";

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF resumes are supported right now"));
    }
    cb(null, true);
  },
});

const router = express.Router();

router.get("/", protect, getProfile);
router.put("/target-role", protect, setTargetRole);
router.post("/resume", protect, upload.single("resume"), uploadResume);

export default router;
