import React from "react";

export default function CartItem({ item, qty, unitPrice, subtitle, onIncrease, onDecrease, onRemove, variantKey }) {
  return (
    <div className="cart-item">
      <img src={item.image} alt={item.name} />
      <div className="cart-info">
        <h4 style={{ margin: 0 }}>{item.name}</h4>
        <p className="muted" style={{ margin: 0 }}>
          {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"} • ₹{unitPrice}
        </p>
        {subtitle && <p className="muted" style={{ margin: 0 }}>{subtitle}</p>}

        <div className="cart-actions">
          <div className="qty-controls">
            <button onClick={() => onDecrease(variantKey)}>-</button>
            <span>{qty}</span>
            <button onClick={() => onIncrease(variantKey)}>+</button>
          </div>
          <button className="btn btn-ghost" onClick={() => onRemove(variantKey)}>Remove</button>
        </div>
      </div>

      <div className="line-total">₹{unitPrice * qty}</div>
    </div>
  );
}
