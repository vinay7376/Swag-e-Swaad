const express = require("express");

const {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/", getFoods);
router.get("/:id", getFoodById);

// Protected routes
router.post("/", protect, admin, createFood);
router.put("/:id", protect, admin, updateFood);
router.delete("/:id", protect, admin, deleteFood);

module.exports = router;
