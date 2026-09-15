import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import generateToken from "../utils/generateToken.js";

const shape = (u) => ({ id: u._id, name: u.name, email: u.email, role: u.role });

// POST /api/auth/register  (only allowed for the very first user)
export const register = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  if (count > 0) {
    res.status(403);
    throw new Error("Registration is closed. An admin already exists.");
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({ success: true, token: generateToken(user._id), user: shape(user) });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  // Same message for both failure modes — don't leak which emails exist
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({ success: true, token: generateToken(user._id), user: shape(user) });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: shape(req.user) });
});