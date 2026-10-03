import React from "react";

export default function CartItem({
  item,
  qty,
  unitPrice,
  subtitle,
  onIncrease,
  onDecrease,
  onRemove,
  variantKey,
}) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-info">
        <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 700 }}>{item.name}</h4>
        <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
          {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"} • ₹{unitPrice}
        </p>
        {subtitle && (
          <p className="muted" style={{ margin: 0, fontSize: "12px" }}>
            {subtitle}
          </p>
        )}

        <div className="cart-actions">
          <div className="qty-controls">
            <button
              type="button"
              onClick={() => onDecrease(variantKey)}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="qty-number">{qty}</span>
            <button
              type="button"
              onClick={() => onIncrease(variantKey)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="btn btn-ghost sm remove-btn"
            onClick={() => onRemove(variantKey)}
            style={{ fontSize: "12px", padding: "4px 10px" }}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="line-total">₹{unitPrice * qty}</div>
    </div>
  );
}
