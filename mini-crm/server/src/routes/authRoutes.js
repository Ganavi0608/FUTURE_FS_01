import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: "Too many login attempts. Try again in 15 minutes." },
});

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.get("/me", protect, getMe);

export default router;