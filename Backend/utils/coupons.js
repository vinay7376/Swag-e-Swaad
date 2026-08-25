const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off subtotal" },
  FLAT50: { type: "flat", value: 50, label: "₹50 off subtotal" },
  FREESHIP: { type: "shipping", value: 0, label: "Free delivery" },
};

function calculateTotals(subtotal, couponInput) {
  const coupon = String(couponInput || "").trim().toUpperCase();
  if (coupon && !COUPONS[coupon]) throw Object.assign(new Error("Invalid coupon code"), { statusCode: 400 });
  const discount = coupon === "SAVE10" ? Math.round(subtotal * 0.1) : coupon === "FLAT50" ? Math.min(50, subtotal) : 0;
  const deliveryFee = coupon === "FREESHIP" ? 0 : 29;
  const tax = Math.round(Math.max(subtotal - discount, 0) * 0.05);
  return { coupon, discount, deliveryFee, tax, total: Math.max(subtotal - discount, 0) + deliveryFee + tax };
}
module.exports = { COUPONS, calculateTotals };
