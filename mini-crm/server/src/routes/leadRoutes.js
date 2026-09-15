import express from "express";
import rateLimit from "express-rate-limit";
import {
  createLead, getLeads, getLead, updateLead, updateLeadStatus,
  addNote, deleteNote, deleteLead, getStats,
} from "../controllers/leadController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many submissions from this IP." },
});

router.post("/", formLimiter, createLead);   // PUBLIC

router.use(protect);                          // everything below needs a token

router.get("/stats/summary", getStats);
router.get("/", getLeads);
router.get("/:id", getLead);
router.put("/:id", updateLead);
router.patch("/:id/status", updateLeadStatus);
router.delete("/:id", deleteLead);
router.post("/:id/notes", addNote);
router.delete("/:id/notes/:noteId", deleteNote);

export default router;