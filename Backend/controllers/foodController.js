const mongoose = require("mongoose");
const Food = require("../models/Food");

const editableFields = ["name", "description", "price", "image", "category", "rating", "isVeg", "isAvailable", "tags", "sizes", "addons"];
const validId = (id) => mongoose.isValidObjectId(id);
function cleanFood(body) {
  const value = {};
  editableFields.forEach((key) => { if (body[key] !== undefined) value[key] = body[key]; });
  ["name", "category", "description"].forEach((key) => { if (value[key] !== undefined) value[key] = String(value[key]).trim(); });
  if (value.tags !== undefined) value.tags = Array.isArray(value.tags) ? value.tags.map((tag) => String(tag).trim()).filter(Boolean) : [];
  return value;
}
function validateFood(value) {
  if (!value.name || !value.category || !Number.isFinite(Number(value.price)) || Number(value.price) < 0) return "Name, category, and a non-negative price are required";
  if (value.rating !== undefined && (!Number.isFinite(Number(value.rating)) || value.rating < 0 || value.rating > 5)) return "Rating must be between 0 and 5";
  return null;
}
exports.getFoods = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.veg === "true") filter.isVeg = true;
    if (req.query.available === "true") filter.isAvailable = true;
    if (req.query.q) filter.$text = { $search: String(req.query.q).slice(0, 80) };
    if (req.query.minRating) filter.rating = { $gte: Number(req.query.minRating) };
    if (req.query.maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(req.query.maxPrice) };
    const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, rating: { rating: -1 }, newest: { createdAt: -1 } };
    const foods = await Food.find(filter).sort(sortMap[req.query.sort] || { rating: -1, createdAt: -1 });
    res.json({ success: true, count: foods.length, foods });
  } catch (error) { next(error); }
};
exports.getFoodById = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid food id" });
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, food });
  } catch (error) { next(error); }
};
exports.createFood = async (req, res, next) => {
  try {
    const value = cleanFood(req.body); const error = validateFood(value);
    if (error) return res.status(400).json({ success: false, message: error });
    const food = await Food.create(value);
    res.status(201).json({ success: true, message: "Food created", food });
  } catch (error) { next(error); }
};
exports.updateFood = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid food id" });
    const food = await Food.findByIdAndUpdate(req.params.id, cleanFood(req.body), { new: true, runValidators: true });
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, message: "Food updated", food });
  } catch (error) { next(error); }
};
exports.deleteFood = async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid food id" });
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, message: "Food deleted" });
  } catch (error) { next(error); }
};
