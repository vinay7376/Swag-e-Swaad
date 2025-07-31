import React, { useMemo, useState } from "react";
import CartItem from "../components/CartItem";
import foodItems from "../data/foodItems";
import { Link } from "react-router-dom";
import { useToast } from "../components/Toast";

const COUPONS = {
  SAVE10: { type: "percent", value: 10, label: "10% off subtotal" },
  FLAT50: { type: "flat", value: 50, label: "₹50 off subtotal" },
  FREESHIP: { type: "ship", value: 0, label: "Free Delivery" },
};

function decodeKey(key) {
  const [idStr, sizePart, addonsPart] = key.split("|");
  const id = Number(idStr);
  const size = sizePart?.split("=")[1] || "M";
  const addons = (addonsPart?.split("=")[1] || "")
    .split(",")
    .filter(Boolean);
  return { id, size, addons };
}

function subtitleFromMeta(size, addons) {
  const sizeTxt = `Size: ${size}`;
  const addonsTxt = addons.length ? `Add-ons: ${addons.join(", ")}` : "No add-ons";
  return `${sizeTxt} • ${addonsTxt}`;
}

export default function Cart({ cart, increaseQty, decreaseQty, removeFromCart, clearCart }) {
  const { push } = useToast();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [note, setNote] = useState("");
  const [address, setAddress] = useState("");
  const [touched, setTouched] = useState(false);

  const items = useMemo(() => {
    return Object.entries(cart)
      .map(([key, { qty, unitPrice, meta }]) => {
        const { id, size, addons } = meta || decodeKey(key);
        const item = foodItems.find((f) => f.id === Number(id));
        return { key, item, qty, unitPrice, size, addons };
      })
      .filter((x) => x.item);
  }, [cart]);

  const subtotal = items.reduce((sum, x) => sum + x.unitPrice * x.qty, 0);
  const baseDelivery = items.length ? 29 : 0;
  const delivery = applied === "FREESHIP" ? 0 : baseDelivery;

  let discount = 0;
  if (applied === "SAVE10") discount = Math.round(subtotal * 0.1);
  if (applied === "FLAT50") discount = Math.min(50, subtotal);

  const taxable = Math.max(subtotal - discount, 0);
  const tax = Math.round(taxable * 0.05);
  const total = taxable + delivery + tax;

  const applyCoupon = () => {
    const upper = code.trim().toUpperCase();
    if (!upper) return;
    if (!COUPONS[upper]) {
      push({ message: "Invalid coupon code", variant: "error" });
      return;
    }
    setApplied(upper);
    push({ message: `Applied ${upper} — ${COUPONS[upper].label}`, variant: "success" });
  };

  const removeCoupon = () => {
    setApplied(null);
    setCode("");
    push({ message: "Coupon removed", variant: "info" });
  };

  const onClearCart = () => {
    clearCart();
    push({ message: "Cart cleared", variant: "info" });
  };

  const onRemoveItem = (key) => {
    removeFromCart(key);
    push({ message: "Item removed", variant: "info" });
  };

  const invalidAddress = touched && !address.trim();

  const checkout = () => {
    setTouched(true);
    if (!address.trim()) {
      push({ message: "Please enter delivery address.", variant: "error" });
      return;
    }
    push({ message: `Order placed! 🎉 Total: ₹${total}`, variant: "success" });
    clearCart();
    setNote("");
    setAddress("");
    setApplied(null);
    setCode("");
  };

  return (
    <div className="cart-page container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Your Cart</h2>
        {items.length > 0 && (
          <span className="muted" style={{ fontWeight: 600 }}>
            Delivery ETA: <span style={{ color: "var(--text)" }}>30–40 min</span>
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty">
          <div className="empty-ill" />
          <h3>Cart is empty</h3>
          <p className="muted">Browse the menu and add something tasty.</p>
          <Link className="btn btn-primary" to="/menu" style={{ marginTop: 10 }}>Browse Menu</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 420px", gap: 20 }}>
          <div className="cart-list">
            {items.map(({ key, item, qty, unitPrice, size, addons }) => (
              <CartItem
                key={key}
                item={item}
                qty={qty}
                unitPrice={unitPrice}
                subtitle={subtitleFromMeta(size, addons)}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                onRemove={onRemoveItem}
                variantKey={key}
              />
            ))}
          </div>

          <aside className="summary">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>Order Summary</h3>
              <button className="btn btn-ghost" onClick={onClearCart}>Clear Cart</button>
            </div>

            {/* Coupons row */}
            <div className="row" style={{ gap: 8, alignItems: "center", marginTop: 6 }}>
              <input
                type="text"
                placeholder="Coupon (SAVE10 / FLAT50 / FREESHIP)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input"
                style={{ flex: 1 }}
              />
              {!applied ? (
                <button className="btn btn-primary" onClick={applyCoupon}>Apply</button>
              ) : (
                <button className="btn btn-ghost" onClick={removeCoupon}>Remove</button>
              )}
            </div>
            {applied && (
              <p className="muted" style={{ marginTop: 6 }}>
                Applied: <strong>{applied}</strong> – {COUPONS[applied].label}
              </p>
            )}

            {/* Totals */}
            <div className="row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="row"><span>Discount</span><span>-₹{discount}</span></div>}
            <div className="row"><span>Delivery</span><span>₹{delivery}</span></div>
            <div className="row"><span>Tax (5%)</span><span>₹{tax}</span></div>
            <hr />
            <div className="row total"><span>Total</span><span>₹{total}</span></div>

            {/* Notes & Address */}
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <label className="label">Order notes (optional)</label>
              <textarea
                className="textarea"
                placeholder="Any preferences or instructions?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <label className="label">Delivery address <span style={{ color: invalidAddress ? "#ef4444" : "var(--muted)" }}>*</span></label>
              <textarea
                className={`textarea ${invalidAddress ? "error" : ""}`}
                placeholder="Flat/House no, Area, City, Pincode"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onBlur={() => setTouched(true)}
              />
              {invalidAddress && <span className="hint error">Address is required to place the order.</span>}
            </div>

            <div className="summary-actions">
              <button className="btn btn-primary" onClick={checkout}>
                Place Order
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
