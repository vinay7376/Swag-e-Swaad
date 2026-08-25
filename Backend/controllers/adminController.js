const User = require("../models/User");
const Food = require("../models/Food");
const Order = require("../models/Order");

exports.dashboard = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const [users, foods, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, todayOrders, revenue, recentOrders] = await Promise.all([
      User.countDocuments(), Food.countDocuments(), Order.countDocuments(), Order.countDocuments({ status: "pending" }), Order.countDocuments({ status: "delivered" }), Order.countDocuments({ status: "cancelled" }), Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([{ $match: { paymentStatus: "paid" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.find().populate("user", "name email").sort({ createdAt: -1 }).limit(8),
    ]);
    res.json({ success: true, dashboard: { users, foods, totalOrders, pendingOrders, deliveredOrders, cancelledOrders, todayOrders, totalRevenue: revenue[0]?.total || 0, recentOrders } });
  } catch (error) { next(error); }
};
exports.users = async (req, res, next) => {
  try {
    const users = await User.aggregate([{ $project: { password: 0 } }, { $lookup: { from: "orders", localField: "_id", foreignField: "user", as: "orderList" } }, { $addFields: { orderCount: { $size: "$orderList" } } }, { $project: { orderList: 0 } }, { $sort: { createdAt: -1 } }]);
    res.json({ success: true, count: users.length, users });
  } catch (error) { next(error); }
};
