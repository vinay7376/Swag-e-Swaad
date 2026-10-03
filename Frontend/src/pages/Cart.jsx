import React, { useMemo, useState, useEffect } from "react";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import { api } from "../services/api";
import {
  ShoppingBag,
  Trash2,
  Tag,
  MapPin,
  FileText,
  CreditCard,
  Banknote,
  Check,
} from "lucide-react";

const COUPONS = {
  SAVE10: {
    type: "percent",
    value: 10,
    label: "10% off subtotal",
  },
  FLAT50: {
    type: "flat",
    value: 50,
    label: "₹50 off subtotal",
  },
  FREESHIP: {
    type: "ship",
    value: 0,
    label: "Free Delivery",
  },
};

function decodeKey(key) {
  const [idStr, sizePart = "M", addonsPart = ""] = String(key || "").split("|");
  const size = sizePart.includes("=") ? sizePart.split("=")[1] : sizePart || "M";
  const rawAddons = addonsPart.includes("=") ? addonsPart.split("=")[1] : addonsPart;
  const addons = (rawAddons || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return { id: idStr, size, addons };
}

function subtitleFromMeta(size, addons) {
  const sizeTxt = `Size: ${size}`;
  const addonsTxt = addons.length ? ` • Add-ons: ${addons.join(", ")}` : "";
  return `${sizeTxt}${addonsTxt}`;
}

export default function Cart({
  cart,
  foodItems,
  foodsLoading = false,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  user,
}) {
  const { push } = useToast();
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto pre-fill address from profile
  useEffect(() => {
    if (!address && user?.address) {
      setAddress(user.address);
    }
  }, [user, address]);

  // =========================
  // CART ITEMS
  // =========================
  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([key, { qty, unitPrice, meta }]) => {
        const decoded = decodeKey(key);
        const id = meta?.id || decoded.id;
        const size = meta?.size || decoded.size;
        const addons = meta?.addons || decoded.addons;

        const item = foodItems?.find(
          (food) => String(food._id) === String(id)
        );

        const sizeMultiplier = { S: 1, M: 1.2, L: 1.5 }[size] || 1;
        const addonPrices = { cheese: 30, toppings: 40, spicy: 0 };
        const computedPrice = Math.round(
          Number(item?.price || 0) * sizeMultiplier +
            addons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0)
        );

        return {
          key,
          item,
          qty,
          size,
          addons,
          unitPrice: Number(unitPrice ?? computedPrice),
        };
      })
      .filter((x) => Boolean(x.item));
  }, [cart, foodItems]);

  // =========================
  // CALCULATIONS
  // =========================
  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, entry) => sum + entry.unitPrice * entry.qty,
      0
    );
  }, [items]);

  const discount = useMemo(() => {
    if (!applied) return 0;
    const rule = COUPONS[applied];
    if (rule.type === "percent") {
      return Math.round((subtotal * rule.value) / 100);
    }
    if (rule.type === "flat") {
      return Math.min(rule.value, subtotal);
    }
    return 0;
  }, [applied, subtotal]);

  const delivery = useMemo(() => {
    if (subtotal === 0) return 0;
    if (applied === "FREESHIP") return 0;
    return subtotal > 499 ? 0 : 29;
  }, [subtotal, applied]);

  const tax = useMemo(() => {
    return Math.round(Math.max(0, subtotal - discount) * 0.05);
  }, [subtotal, discount]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount + delivery + tax);
  }, [subtotal, discount, delivery, tax]);

  const invalidAddress =
    touched && (!address.trim() || address.trim().length < 10);

  // Apply Coupon
  const applyCoupon = (couponCode) => {
    const couponToApply = (couponCode || code).trim().toUpperCase();
    if (!couponToApply) return;

    if (COUPONS[couponToApply]) {
      setApplied(couponToApply);
      setCode(couponToApply);
      push({
        message: `Coupon ${couponToApply} applied successfully! 🎉`,
        variant: "success",
      });
    } else {
      push({
        message: "Invalid coupon code. Try SAVE10, FLAT50 or FREESHIP.",
        variant: "error",
      });
    }
  };

  const removeCoupon = () => {
    setApplied(null);
    setCode("");
    push({
      message: "Coupon removed.",
      variant: "info",
    });
  };

  // =========================
  // RAZORPAY SCRIPT LOADER
  // =========================
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        return resolve(true);
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // =========================
  // CHECKOUT (COD or ONLINE)
  // =========================
  const checkout = async (paymentMethod = "cod") => {
    setTouched(true);

    if (!address.trim() || address.trim().length < 10) {
      push({
        message: "Please enter a complete delivery address (at least 10 characters).",
        variant: "error",
      });
      return;
    }

    if (items.length === 0) {
      push({
        message: "Your cart is empty.",
        variant: "error",
      });
      return;
    }

    const token = localStorage.getItem("fz_token");

    if (!token || !user) {
      push({
        message: "Please login before placing your order.",
        variant: "error",
      });
      navigate("/login", { state: { from: "/cart" } });
      return;
    }

    let createdOrderId = null;

    try {
      setSubmitting(true);

      const orderItems = items.map((item) => ({
        foodId: item.item._id,
        quantity: item.qty,
        size: item.size,
        addons: item.addons,
      }));

      const data = await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          items: orderItems,
          address: address.trim(),
          note,
          coupon: applied || "",
          paymentMethod,
        }),
      });

      createdOrderId = data.order._id;

      if (paymentMethod === "online") {
        let payment;
        if (data.payment?.isMock) {
          const proceed = window.confirm(
            `💳 Razorpay Online Payment (Simulator Mode)\n\nOrder #${data.order._id.slice(-6)}\nTotal Amount: ₹${data.order.total}\n\nClick OK to simulate successful payment, or Cancel to abort.`
          );
          if (!proceed) {
            throw new Error("Payment cancelled by user");
          }
          payment = {
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_order_id: data.payment.orderId,
            razorpay_signature: "mock_signature_approved",
          };
        } else {
          await loadRazorpay();
          payment = await new Promise((resolve, reject) => {
            const checkoutWindow = new window.Razorpay({
              key: data.payment.keyId,
              amount: data.payment.amount,
              currency: data.payment.currency,
              name: "Swag-e-Swaad",
              description: `Order #${data.order._id.slice(-6)}`,
              order_id: data.payment.orderId,
              handler: resolve,
              modal: {
                ondismiss: () => reject(new Error("Payment window closed")),
              },
            });
            checkoutWindow.open();
          });
        }

        await api("/orders/verify-payment", {
          method: "POST",
          body: JSON.stringify({ orderId: data.order._id, ...payment }),
        });
      }

      push({
        message:
          paymentMethod === "online"
            ? "Payment verified! Your order is being prepared! 🎉"
            : `Order placed successfully! 🎉 Order #${data.order._id.slice(-6)}`,
        variant: "success",
      });

      clearCart();
      setNote("");
      setAddress("");
      setApplied(null);
      setCode("");
      setTouched(false);

      // Redirect directly to the live Order Receipt & Tracking page
      navigate(`/orders/${data.order._id}`);
    } catch (error) {
      console.error("Place Order Error:", error);

      if (paymentMethod === "online" && createdOrderId) {
        api(`/orders/${createdOrderId}/payment-failed`, {
          method: "PATCH",
          body: JSON.stringify({ reason: error.message || "Payment failed" }),
        }).catch(() => {});
      }

      push({
        message: error.message || "Failed to place order. Please try again.",
        variant: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cart-page container">
      {/* HEADER */}
      <div className="cart-page-header">
        <div>
          <h1 className="cart-main-heading">Shopping Cart 🛒</h1>
          <p className="cart-subheading">
            {items.length > 0
              ? `You have ${items.length} delicious item(s) ready for checkout.`
              : "Your cart is currently empty."}
          </p>
        </div>

        {items.length > 0 && (
          <button
            className="btn-clear-cart"
            onClick={clearCart}
            title="Remove all items from cart"
          >
            <Trash2 size={16} />
            <span>Clear Cart</span>
          </button>
        )}
      </div>

      {/* EMPTY CART */}
      {items.length === 0 ? (
        <div className="empty-cart-card">
          <div className="empty-cart-emoji">🍽️</div>
          <h2>Your cart is feeling light!</h2>
          <p className="muted">
            Explore our curated menu of pizzas, royal biryanis, and crunchy snacks to fill it up.
          </p>
          <Link to="/menu" className="btn btn-primary btn-explore-menu">
            <ShoppingBag size={17} />
            <span>Explore Menu & Order</span>
          </Link>
        </div>
      ) : (
        /* TWO COLUMN LAYOUT */
        <div className="cart-layout">
          {/* LEFT: ITEMS LIST */}
          <div className="cart-items-column">
            <div className="cart-items-wrapper">
              {items.map((entry) => (
                <CartItem
                  key={entry.key}
                  variantKey={entry.key}
                  item={entry.item}
                  qty={entry.qty}
                  unitPrice={entry.unitPrice}
                  subtitle={subtitleFromMeta(entry.size, entry.addons)}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Back to menu helper */}
            <div className="cart-add-more-strip">
              <span>Craving more delicacies?</span>
              <Link to="/menu" className="link-add-more">
                + Add More Dishes
              </Link>
            </div>
          </div>

          {/* RIGHT: ORDER SUMMARY SIDEBAR */}
          <aside className="cart-summary-sidebar">
            <h3 className="summary-card-title">Order Bill Details</h3>

            {/* FREE DELIVERY HINT */}
            {subtotal < 500 && applied !== "FREESHIP" && (
              <div className="free-ship-banner">
                <span>Add ₹{500 - subtotal} more for <strong>FREE Delivery</strong>!</span>
              </div>
            )}

            {/* COUPON INPUT & QUICK CHIPS */}
            <div className="cart-coupon-section">
              <label className="sidebar-field-label">
                <Tag size={14} />
                <span>Apply Coupon Code</span>
              </label>

              <div className="coupon-input-group">
                <input
                  type="text"
                  placeholder="SAVE10, FLAT50..."
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="coupon-text-input"
                  disabled={!!applied}
                />
                {!applied ? (
                  <button
                    className="btn-apply-coupon"
                    onClick={() => applyCoupon(code)}
                    disabled={!code.trim()}
                  >
                    Apply
                  </button>
                ) : (
                  <button className="btn-remove-coupon" onClick={removeCoupon}>
                    Remove
                  </button>
                )}
              </div>

              {/* QUICK TAP COUPON CHIPS */}
              {!applied && (
                <div className="quick-coupons-row">
                  <button
                    type="button"
                    className="coupon-quick-chip"
                    onClick={() => applyCoupon("SAVE10")}
                  >
                    SAVE10 (10% OFF)
                  </button>
                  <button
                    type="button"
                    className="coupon-quick-chip"
                    onClick={() => applyCoupon("FLAT50")}
                  >
                    FLAT50 (₹50 OFF)
                  </button>
                  <button
                    type="button"
                    className="coupon-quick-chip"
                    onClick={() => applyCoupon("FREESHIP")}
                  >
                    FREESHIP
                  </button>
                </div>
              )}

              {applied && (
                <div className="coupon-active-badge">
                  <Check size={14} color="#16a34a" />
                  <span>Applied: <strong>{applied}</strong> ({COUPONS[applied].label})</span>
                </div>
              )}
            </div>

            {/* BILL BREAKDOWN */}
            <div className="bill-breakdown-list">
              <div className="bill-row">
                <span>Item Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="bill-row row-discount">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="bill-row">
                <span>Delivery Fee</span>
                <span>{delivery === 0 ? <strong style={{ color: "#16a34a" }}>FREE</strong> : `₹${delivery}`}</span>
              </div>

              <div className="bill-row">
                <span>Taxes & Charges (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="bill-divider" />

              <div className="bill-row bill-grand-total">
                <span>To Pay</span>
                <span className="grand-total-amount">₹{total}</span>
              </div>
            </div>

            {/* ADDRESS & NOTES */}
            <div className="checkout-inputs-block">
              {/* Delivery Address */}
              <div className="checkout-field">
                <div className="field-label-row">
                  <label className="sidebar-field-label">
                    <MapPin size={14} />
                    <span>Delivery Address</span>
                  </label>
                  <span className="char-counter">{address.length}/500</span>
                </div>

                <textarea
                  className={`checkout-textarea ${invalidAddress ? "input-has-error" : ""}`}
                  placeholder="Complete delivery address: Flat/House No, Street, Landmark, Pincode"
                  value={address}
                  maxLength={500}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={() => setTouched(true)}
                  rows="3"
                />

                {invalidAddress && (
                  <span className="error-validation-msg">
                    * Full address is required (10–500 characters).
                  </span>
                )}
              </div>

              {/* Order Notes */}
              <div className="checkout-field">
                <label className="sidebar-field-label">
                  <FileText size={14} />
                  <span>Cooking / Delivery Instructions</span>
                </label>
                <textarea
                  className="checkout-textarea"
                  placeholder="e.g. Please ring bell, less spicy, extra napkins..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="2"
                />
              </div>
            </div>

            {/* CHECKOUT ACTION BUTTONS */}
            <div className="checkout-cta-group">
              <button
                className="btn-pay-cod"
                onClick={() => checkout("cod")}
                disabled={submitting}
              >
                <Banknote size={18} />
                <span>{submitting ? "Placing Order..." : "Cash on Delivery (COD)"}</span>
              </button>

              <button
                className="btn-pay-online"
                onClick={() => checkout("online")}
                disabled={submitting}
              >
                <CreditCard size={18} />
                <span>{submitting ? "Processing..." : "Pay Online (Cards / UPI)"}</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
