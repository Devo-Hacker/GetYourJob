import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAccount, updateProfile } from "../controllers/accountController.js";

const router = express.Router();

router.get("/", protect, getAccount);
router.patch("/profile", protect, updateProfile);

export default router;