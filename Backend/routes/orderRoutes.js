const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  verifyPayment, markPaymentFailed, cancelMyOrder,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================
// USER - CREATE ORDER
// =========================
router.post(
  "/",
  authMiddleware,
  createOrder
);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.patch("/:id/payment-failed", authMiddleware, markPaymentFailed);

// =========================
// USER - MY ORDERS
// =========================
router.get(
  "/my-orders",
  authMiddleware,
  getMyOrders
);
router.patch("/:id/cancel", authMiddleware, cancelMyOrder);

// =========================
// ADMIN - ALL ORDERS
// IMPORTANT: admin route before /:id
// =========================
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// =========================
// ADMIN - UPDATE ORDER STATUS
// =========================
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// =========================
// USER - SINGLE ORDER
// =========================
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

module.exports = router;
