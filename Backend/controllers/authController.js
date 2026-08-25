const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || ""));
const serializeUser = (user) => ({ id: user._id, name: user.name, email: user.email, phone: user.phone || "", address: user.address || "", role: user.role, createdAt: user.createdAt });
const makeToken = (user) => jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

// =========================
// REGISTER USER
// =========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check required fields
    if (!name?.trim() || !isEmail(email) || !password || password.length < 8) {
      return res.status(400).json({
        success: false, message: "Enter a name, valid email, and password of at least 8 characters",
      });
    }

    // Check if user already exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false, message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name: name.trim(), email: normalizedEmail,
      password: hashedPassword,
      phone: String(phone || "").trim(), address: String(address || "").trim(),
    });

    res.status(201).json({
      success: true, message: "User registered successfully", token: makeToken(user), user: serializeUser(user),
    });
  } catch (error) {
    console.error("Register Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// LOGIN USER
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!isEmail(email) || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = makeToken(user);

    res.status(200).json({
      success: true, message: "Login successful",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// =========================
// GET PROFILE
// =========================
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true, message: "Profile fetched successfully", user: serializeUser(req.user),
    });
  } catch (error) {
    console.error("Profile Error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    if (name !== undefined && !String(name).trim()) return res.status(400).json({ success: false, message: "Name cannot be empty" });
    const user = await User.findByIdAndUpdate(req.user._id, { ...(name !== undefined && { name: String(name).trim() }), ...(phone !== undefined && { phone: String(phone).trim() }), ...(address !== undefined && { address: String(address).trim() }) }, { new: true, runValidators: true }).select("-password");
    res.json({ success: true, message: "Profile updated", user: serializeUser(user) });
  } catch (error) { next(error); }
};
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 8) return res.status(400).json({ success: false, message: "Current password and a new password of at least 8 characters are required" });
    const user = await User.findById(req.user._id);
    if (!(await bcrypt.compare(currentPassword, user.password))) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    user.password = await bcrypt.hash(newPassword, 12); await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (error) { next(error); }
};

// =========================
// EXPORT CONTROLLERS
// =========================
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile, changePassword,
};
