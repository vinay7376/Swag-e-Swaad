import React from "react";
import { Trash2, Plus, Minus } from "lucide-react";

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
  const safeImage = item.image ? encodeURI(item.image) : "";

  return (
    <div className="modern-cart-item">
      {/* Thumbnail */}
      <div className="cart-item-media">
        <img
          src={safeImage}
          alt={item.name}
          className="cart-item-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <div className={`cart-diet-indicator ${item.isVeg ? "diet-veg" : "diet-nonveg"}`}>
          <span className="diet-dot" />
        </div>
      </div>

      {/* Info */}
      <div className="cart-item-info">
        <div className="cart-item-header">
          <h4 className="cart-item-title">{item.name}</h4>
          <span className="cart-unit-price">₹{unitPrice} each</span>
        </div>

        {subtitle && (
          <div className="cart-variant-badge">
            <span>{subtitle}</span>
          </div>
        )}

        <div className="cart-controls-row">
          {/* Stepper */}
          <div className="cart-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onDecrease(variantKey)}
              aria-label="Decrease quantity"
            >
              <Minus size={13} />
            </button>
            <span className="stepper-qty">{qty}</span>
            <button
              type="button"
              className="stepper-btn"
              onClick={() => onIncrease(variantKey)}
              aria-label="Increase quantity"
            >
              <Plus size={13} />
            </button>
          </div>

          {/* Remove Button */}
          <button
            type="button"
            className="cart-remove-icon-btn"
            onClick={() => onRemove(variantKey)}
            title="Remove item from cart"
          >
            <Trash2 size={16} />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Total for this line */}
      <div className="cart-line-total">
        <span className="total-currency">₹</span>
        <span className="total-figure">{unitPrice * qty}</span>
      </div>
    </div>
  );
}
