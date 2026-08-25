const crypto = require("crypto");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const Food = require("../models/Food");
const { calculateTotals } = require("../utils/coupons");

const validId = (id) => mongoose.isValidObjectId(id);
const NEXT = { pending: ["confirmed", "cancelled"], confirmed: ["preparing", "cancelled"], preparing: ["out_for_delivery", "cancelled"], out_for_delivery: ["delivered"], delivered: [], cancelled: [] };
function getRazorpay() { if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null; return new (require("razorpay"))({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET }); }
async function priceItems(items) {
  if (!Array.isArray(items) || !items.length || items.length > 30) throw Object.assign(new Error("Order must contain between 1 and 30 items"), { statusCode: 400 });
  const ids = items.map((item) => item.foodId);
  if (ids.some((id) => !validId(id))) throw Object.assign(new Error("One or more food ids are invalid"), { statusCode: 400 });
  const foods = await Food.find({ _id: { $in: ids } }); const byId = new Map(foods.map((food) => [String(food._id), food]));
  let subtotal = 0;
  const orderItems = items.map((item) => {
    const food = byId.get(String(item.foodId));
    if (!food) throw Object.assign(new Error("A selected food item no longer exists"), { statusCode: 404 });
    if (!food.isAvailable) throw Object.assign(new Error(`${food.name} is currently unavailable`), { statusCode: 400 });
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) throw Object.assign(new Error("Quantity must be a whole number between 1 and 20"), { statusCode: 400 });
    const size = String(item.size || "M"); const sizeOption = food.sizes.find((option) => option.key === size);
    if (!sizeOption) throw Object.assign(new Error(`Invalid size for ${food.name}`), { statusCode: 400 });
    const addonKeys = [...new Set(Array.isArray(item.addons) ? item.addons.map(String) : [])];
    const addons = addonKeys.map((key) => food.addons.find((addon) => addon.key === key)).filter(Boolean);
    if (addons.length !== addonKeys.length) throw Object.assign(new Error(`Invalid add-on for ${food.name}`), { statusCode: 400 });
    const price = Math.round(food.price * sizeOption.multiplier + addons.reduce((sum, addon) => sum + addon.price, 0));
    subtotal += price * quantity;
    return { food: food._id, name: food.name, price, quantity, image: food.image, size, addons: addons.map((addon) => addon.label || addon.key) };
  });
  return { orderItems, subtotal };
}
exports.createOrder = async (req, res, next) => {
  try {
    const address = String(req.body.address || "").trim();
    const paymentMethod = req.body.paymentMethod === "online" ? "online" : req.body.paymentMethod === "cod" ? "cod" : null;
    if (address.length < 10 || address.length > 500) return res.status(400).json({ success: false, message: "Enter a complete delivery address (10–500 characters)" });
    if (!paymentMethod) return res.status(400).json({ success: false, message: "Payment method must be cod or online" });
    const { orderItems, subtotal } = await priceItems(req.body.items);
    const totals = calculateTotals(subtotal, req.body.coupon);
    const order = await Order.create({ user: req.user._id, items: orderItems, subtotal, ...totals, address, note: String(req.body.note || "").trim().slice(0, 500), paymentMethod, paymentStatus: "pending" });
    if (paymentMethod === "online") {
      const razorpay = getRazorpay();
      if (!razorpay) return res.status(503).json({ success: false, message: "Online payments are not configured" });
      const gatewayOrder = await razorpay.orders.create({ amount: order.total * 100, currency: "INR", receipt: String(order._id) });
      order.payment.providerOrderId = gatewayOrder.id; await order.save();
      return res.status(201).json({ success: true, message: "Payment order created", order, payment: { keyId: process.env.RAZORPAY_KEY_ID, orderId: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency } });
    }
    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) { next(error); }
};
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpay_payment_id: paymentId, razorpay_order_id: gatewayOrderId, razorpay_signature: signature } = req.body;
    if (!validId(orderId) || !paymentId || !gatewayOrderId || !signature) return res.status(400).json({ success: false, message: "Incomplete payment verification data" });
    const order = await Order.findOne({ _id: orderId, user: req.user._id, paymentMethod: "online" });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.paymentStatus === "paid") return res.json({ success: true, message: "Payment already verified", order });
    if (order.payment.providerOrderId !== gatewayOrderId) return res.status(400).json({ success: false, message: "Payment order does not match" });
    const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(`${gatewayOrderId}|${paymentId}`).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return res.status(400).json({ success: false, message: "Payment signature verification failed" });
    order.paymentStatus = "paid"; order.payment.paymentId = paymentId; await order.save();
    res.json({ success: true, message: "Payment verified", order });
  } catch (error) { next(error); }
};
exports.markPaymentFailed = async (req, res, next) => { try { const order = await Order.findOneAndUpdate({ _id: req.params.id, user: req.user._id, paymentMethod: "online", paymentStatus: "pending" }, { paymentStatus: "failed", "payment.failureReason": String(req.body.reason || "Payment cancelled").slice(0, 300) }, { new: true }); if (!order) return res.status(404).json({ success: false, message: "Pending online order not found" }); res.json({ success: true, order }); } catch (error) { next(error); } };
exports.getMyOrders = async (req, res, next) => { try { const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); res.json({ success: true, count: orders.length, orders }); } catch (error) { next(error); } };
exports.getOrderById = async (req, res, next) => { try { if (!validId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid order id" }); const filter = req.user.role === "admin" ? { _id: req.params.id } : { _id: req.params.id, user: req.user._id }; const order = await Order.findOne(filter).populate("user", "name email phone"); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); res.json({ success: true, order }); } catch (error) { next(error); } };
exports.cancelMyOrder = async (req, res, next) => { try { const order = await Order.findOne({ _id: req.params.id, user: req.user._id }); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); if (!["pending", "confirmed"].includes(order.status)) return res.status(400).json({ success: false, message: "This order can no longer be cancelled" }); order.status = "cancelled"; order.statusHistory.push({ status: "cancelled" }); await order.save(); res.json({ success: true, message: "Order cancelled", order }); } catch (error) { next(error); } };
exports.getAllOrders = async (req, res, next) => { try { const filter = req.query.status ? { status: req.query.status } : {}; if (req.query.q) filter.$or = [{ _id: mongoose.isValidObjectId(req.query.q) ? req.query.q : undefined }, { "items.name": new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }].filter(Boolean); const orders = await Order.find(filter).populate("user", "name email phone").sort({ createdAt: -1 }); res.json({ success: true, count: orders.length, orders }); } catch (error) { next(error); } };
exports.updateOrderStatus = async (req, res, next) => { try { const status = req.body.status; const order = await Order.findById(req.params.id); if (!order) return res.status(404).json({ success: false, message: "Order not found" }); if (!NEXT[order.status]?.includes(status)) return res.status(400).json({ success: false, message: `Cannot change ${order.status} to ${status}` }); order.status = status; order.statusHistory.push({ status }); await order.save(); res.json({ success: true, message: "Order status updated", order }); } catch (error) { next(error); } };
