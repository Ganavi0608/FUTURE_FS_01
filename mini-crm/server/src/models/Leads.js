import mongoose from "mongoose";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"];
export const LEAD_SOURCES = ["website", "referral", "linkedin", "instagram", "cold-call", "other"];

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    authorName: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

const historySchema = new mongoose.Schema(
  {
    from: String,
    to: String,
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    changedByName: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    message: { type: String, trim: true, maxlength: 3000, default: "" },
    source: { type: String, enum: LEAD_SOURCES, default: "website" },
    status: { type: String, enum: LEAD_STATUSES, default: "new", index: true },
    value: { type: Number, default: 0, min: 0 },        // estimated deal value
    nextFollowUpAt: { type: Date, default: null },
    notes: [noteSchema],
    statusHistory: [historySchema],
  },
  { timestamps: true } // gives you createdAt / updatedAt for free
);

leadSchema.index({ createdAt: -1 });

export default mongoose.model("Lead", leadSchema);