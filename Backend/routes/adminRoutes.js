const express = require("express");
const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const { dashboard, users } = require("../controllers/adminController");
const router = express.Router();
router.use(protect, admin);
router.get("/dashboard", dashboard);
router.get("/users", users);
module.exports = router;
