import React, { useMemo, useState } from "react";
import CartItem from "../components/CartItem";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";

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
  const [idStr, sizePart, addonsPart] = key.split("|");

  const size = sizePart?.split("=")[1] || "M";

  const addons = (addonsPart?.split("=")[1] || "")
    .split(",")
    .filter(Boolean);

  return {
    id: idStr,
    size,
    addons,
  };
}

function subtitleFromMeta(size, addons) {
  const sizeTxt = `Size: ${size}`;

  const addonsTxt = addons.length
    ? `Add-ons: ${addons.join(", ")}`
    : "No add-ons";

  return `${sizeTxt} • ${addonsTxt}`;
}

export default function Cart({
  cart,
  foodItems,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  user,
}) {
  const { push } = useToast();

  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);

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
        const computedPrice = Math.round(Number(item?.price || 0) * sizeMultiplier + addons.reduce((sum, addon) => sum + (addonPrices[addon] || 0), 0));
        return {
          key,
          item,
          qty,
          unitPrice: Number.isFinite(Number(unitPrice)) ? Number(unitPrice) : computedPrice,
          size,
          addons,
        };
      })
      .filter((x) => x.item);
  }, [cart, foodItems]);

  // =========================
  // TOTALS
  // =========================
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.unitPrice) * item.qty,
    0
  );

  const baseDelivery = items.length > 0 ? 29 : 0;

  const delivery =
    applied === "FREESHIP" ? 0 : baseDelivery;

  let discount = 0;

  if (applied === "SAVE10") {
    discount = Math.round(subtotal * 0.1);
  }

  if (applied === "FLAT50") {
    discount = Math.min(50, subtotal);
  }

  const taxable = Math.max(subtotal - discount, 0);

  const tax = Math.round(taxable * 0.05);

  const total = taxable + delivery + tax;

  // =========================
  // APPLY COUPON
  // =========================
  const applyCoupon = () => {
    const upper = code.trim().toUpperCase();

    if (!upper) return;

    if (!COUPONS[upper]) {
      push({
        message: "Invalid coupon code",
        variant: "error",
      });

      return;
    }

    setApplied(upper);

    push({
      message: `Applied ${upper} — ${COUPONS[upper].label}`,
      variant: "success",
    });
  };

  // =========================
  // REMOVE COUPON
  // =========================
  const removeCoupon = () => {
    setApplied(null);
    setCode("");

    push({
      message: "Coupon removed",
      variant: "info",
    });
  };

  // =========================
  // CLEAR CART
  // =========================
  const onClearCart = () => {
    clearCart();

    push({
      message: "Cart cleared",
      variant: "info",
    });
  };

  // =========================
  // REMOVE ITEM
  // =========================
  const onRemoveItem = (key) => {
    removeFromCart(key);

    push({
      message: "Item removed",
      variant: "info",
    });
  };

  // =========================
  // ADDRESS
  // =========================
  const invalidAddress = touched && !address.trim();

  // =========================
  // PLACE ORDER
  // =========================
  const loadRazorpay = () => new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = resolve; script.onerror = () => reject(new Error("Unable to load secure payment checkout"));
    document.body.appendChild(script);
  });

  const checkout = async (paymentMethod = "cod") => {
    setTouched(true);
    let createdOrderId = "";

    if (!address.trim()) {
      push({
        message: "Please enter delivery address.",
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

    try {
      const token = localStorage.getItem("fz_token");

      if (!token || !user) {
        push({
          message: "Please login before placing an order.",
          variant: "error",
        });

        return;
      }

      const orderItems = items.map((item) => ({
        foodId: item.item._id,
        quantity: item.qty,
        size: item.size,
        addons: item.addons,
      }));

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            items: orderItems,
            address: address.trim(),
            note,
            coupon: applied || "",
            paymentMethod,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      createdOrderId = data.order._id;

      if (paymentMethod === "online") {
        await loadRazorpay();
        const payment = await new Promise((resolve, reject) => {
          const checkoutWindow = new window.Razorpay({ key: data.payment.keyId, amount: data.payment.amount, currency: data.payment.currency, name: "Swag-e-Swaad", description: `Order #${data.order._id.slice(-6)}`, order_id: data.payment.orderId, handler: resolve, modal: { ondismiss: () => reject(new Error("Payment cancelled")) } });
          checkoutWindow.open();
        });
        const verification = await fetch("http://localhost:5000/api/orders/verify-payment", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ orderId: data.order._id, ...payment }) });
        const verified = await verification.json(); if (!verification.ok) throw new Error(verified.message || "Payment could not be verified");
      }
      push({ message: paymentMethod === "online" ? "Payment verified and order placed! 🎉" : `Order placed successfully! 🎉 Total: ₹${data.order.total}`, variant: "success" });

      clearCart();

      setNote("");
      setAddress("");
      setApplied(null);
      setCode("");
      setTouched(false);
    } catch (error) {
      console.error("Place Order Error:", error);

      if (paymentMethod === "online" && createdOrderId) {
        fetch(`http://localhost:5000/api/orders/${createdOrderId}/payment-failed`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("fz_token")}` },
          body: JSON.stringify({ reason: error.message || "Payment failed" }),
        }).catch(() => {});
      }

      push({
        message:
          error.message || "Failed to place order",
        variant: "error",
      });
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="cart-page container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Your Cart</h2>

        {items.length > 0 && (
          <span
            className="muted"
            style={{ fontWeight: 600 }}
          >
            Delivery ETA:{" "}
            <span style={{ color: "var(--text)" }}>
              30–40 min
            </span>
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-ill" />

          <h3>Cart is empty</h3>

          <p className="muted">
            Browse the menu and add something tasty.
          </p>

          <Link
            className="btn btn-primary"
            to="/menu"
            style={{ marginTop: 10 }}
          >
            Browse Menu
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 420px",
            gap: 20,
          }}
        >
          {/* CART ITEMS */}
          <div className="cart-list">
            {items.map(
              ({
                key,
                item,
                qty,
                unitPrice,
                size,
                addons,
              }) => (
                <CartItem
                  key={key}
                  item={item}
                  qty={qty}
                  unitPrice={unitPrice}
                  subtitle={subtitleFromMeta(
                    size,
                    addons
                  )}
                  onIncrease={increaseQty}
                  onDecrease={decreaseQty}
                  onRemove={onRemoveItem}
                  variantKey={key}
                />
              )
            )}
          </div>

          {/* ORDER SUMMARY */}
          <aside className="summary">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <h3 style={{ margin: 0 }}>
                Order Summary
              </h3>

              <button
                className="btn btn-ghost"
                onClick={onClearCart}
              >
                Clear Cart
              </button>
            </div>

            {/* COUPON */}
            <div
              className="row"
              style={{
                gap: 8,
                alignItems: "center",
                marginTop: 6,
              }}
            >
              <input
                type="text"
                placeholder="Coupon (SAVE10 / FLAT50 / FREESHIP)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />

              {!applied ? (
                <button
                  className="btn btn-primary"
                  onClick={applyCoupon}
                >
                  Apply
                </button>
              ) : (
                <button
                  className="btn btn-ghost"
                  onClick={removeCoupon}
                >
                  Remove
                </button>
              )}
            </div>

            {applied && (
              <p
                className="muted"
                style={{ marginTop: 6 }}
              >
                Applied:{" "}
                <strong>{applied}</strong> –{" "}
                {COUPONS[applied].label}
              </p>
            )}

            {/* TOTALS */}
            <div className="row">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="row">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}

            <div className="row">
              <span>Delivery</span>
              <span>₹{delivery}</span>
            </div>

            <div className="row">
              <span>Tax (5%)</span>
              <span>₹{tax}</span>
            </div>

            <hr />

            <div className="row total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            {/* NOTES + ADDRESS */}
            <div
              style={{
                marginTop: 12,
                display: "grid",
                gap: 8,
              }}
            >
              <label className="label">
                Order notes (optional)
              </label>

              <textarea
                className="textarea"
                placeholder="Any preferences or instructions?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <label className="label">
                Delivery address{" "}
                <span
                  style={{
                    color: invalidAddress
                      ? "#ef4444"
                      : "var(--muted)",
                  }}
                >
                  *
                </span>
              </label>

              <textarea
                className={`textarea ${
                  invalidAddress ? "error" : ""
                }`}
                placeholder="Flat/House no, Area, City, Pincode"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                onBlur={() => setTouched(true)}
              />

              {invalidAddress && (
                <span className="hint error">
                  Address is required to place the order.
                </span>
              )}
            </div>

            {/* PLACE ORDER */}
            <div className="summary-actions">
              <button
                className="btn btn-primary"
                onClick={() => checkout("cod")}
              >
                Place COD Order
              </button>
              <button className="btn btn-ghost" onClick={() => checkout("online")}>Pay Online</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
