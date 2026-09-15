import Lead, { LEAD_STATUSES, LEAD_SOURCES } from "../models/Leads.js";
import asyncHandler from "../utils/asyncHandler.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// POST /api/leads  — PUBLIC (website contact form)
export const createLead = asyncHandler(async (req, res) => {
  const { name, email, phone, company, message, source } = req.body;

  const lead = await Lead.create({
    name,
    email,
    phone,
    company,
    message,
    source: LEAD_SOURCES.includes(source) ? source : "website",
    status: "new",
  });

  res.status(201).json({
    success: true,
    message: "Thanks! We'll get back to you shortly.",
    leadId: lead._id,
  });
});

// GET /api/leads  — filtering, search, sorting, pagination
export const getLeads = asyncHandler(async (req, res) => {
  const { status = "all", source = "all", search = "", sort = "-createdAt" } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));

  const filter = {};
  if (status !== "all" && LEAD_STATUSES.includes(status)) filter.status = status;
  if (source !== "all" && LEAD_SOURCES.includes(source)) filter.source = source;

  if (search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ name: rx }, { email: rx }, { company: rx }, { phone: rx }];
  }

  const [leads, total] = await Promise.all([
    Lead.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).select("-notes -statusHistory"),
    Lead.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: leads,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
  });
});

// GET /api/leads/:id
export const getLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, data: lead });
});

// PATCH /api/leads/:id/status
export const updateLeadStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!LEAD_STATUSES.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${LEAD_STATUSES.join(", ")}`);
  }

  const lead = await Lead.findById(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }

  if (lead.status !== status) {
    lead.statusHistory.push({
      from: lead.status,
      to: status,
      changedBy: req.user._id,
      changedByName: req.user.name,
    });
    lead.status = status;
    await lead.save();
  }

  res.json({ success: true, data: lead });
});

// PUT /api/leads/:id  — edit core fields
export const updateLead = asyncHandler(async (req, res) => {
  const allowed = ["name", "email", "phone", "company", "message", "source", "value", "nextFollowUpAt"];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });

  const lead = await Lead.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, data: lead });
});

// POST /api/leads/:id/notes
export const addNote = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    res.status(400);
    throw new Error("Note text is required");
  }

  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { $push: { notes: { text: text.trim(), author: req.user._id, authorName: req.user.name } } },
    { new: true, runValidators: true }
  );
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.status(201).json({ success: true, data: lead });
});

// DELETE /api/leads/:id/notes/:noteId
export const deleteNote = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndUpdate(
    req.params.id,
    { $pull: { notes: { _id: req.params.noteId } } },
    { new: true }
  );
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, data: lead });
});

// DELETE /api/leads/:id
export const deleteLead = asyncHandler(async (req, res) => {
  const lead = await Lead.findByIdAndDelete(req.params.id);
  if (!lead) {
    res.status(404);
    throw new Error("Lead not found");
  }
  res.json({ success: true, message: "Lead deleted" });
});

// GET /api/leads/stats/summary
export const getStats = asyncHandler(async (req, res) => {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const [total, statusAgg, sourceAgg, dailyAgg, valueAgg] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Lead.aggregate([{ $group: { _id: "$source", count: { $sum: 1 } } }]),
    Lead.aggregate([
      { $match: { createdAt: { $gte: since } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
    Lead.aggregate([
      { $match: { status: "converted" } },
      { $group: { _id: null, revenue: { $sum: "$value" } } },
    ]),
  ]);

  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, 0]));
  statusAgg.forEach((r) => (byStatus[r._id] = r.count));

  res.json({
    success: true,
    data: {
      total,
      byStatus,
      bySource: sourceAgg.map((r) => ({ source: r._id, count: r.count })),
      last7Days: dailyAgg.map((r) => ({ date: r._id, count: r.count })),
      convertedRevenue: valueAgg[0]?.revenue || 0,
      conversionRate: total ? +((byStatus.converted / total) * 100).toFixed(1) : 0,
    },
  });
});