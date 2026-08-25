const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Authentication token is required" });
    }

    // Get token
    const token = authHeader.split(" ")[1];

    // Verify token
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User account no longer exists" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    return res.status(401).json({ success: false, message: error.name === "TokenExpiredError" ? "Session expired. Please sign in again." : "Invalid authentication token" });
  }
};

module.exports = protect;
