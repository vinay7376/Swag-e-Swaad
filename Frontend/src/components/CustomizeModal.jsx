import React, { useMemo, useState } from "react";
import { X, Check, ShoppingBag } from "lucide-react";

const SIZES = [
  { key: "S", label: "Small (Regular)", multiplier: 1.0, desc: "Serves 1" },
  { key: "M", label: "Medium (Standard)", multiplier: 1.2, desc: "Serves 1-2" },
  { key: "L", label: "Large (Feast)", multiplier: 1.5, desc: "Serves 2-3" },
];

const ADDONS = [
  { key: "cheese", label: "Extra Melted Cheese", price: 30 },
  { key: "toppings", label: "Extra Fresh Toppings", price: 40 },
  { key: "spicy", label: "Extra Spicy Seasoning", price: 0 },
];

export default function CustomizeModal({ open, onClose, item, onConfirm }) {
  const [size, setSize] = useState("M");
  const [addons, setAddons] = useState([]);

  const basePrice = item?.price || 0;

  const unitPrice = useMemo(() => {
    if (!item) return 0;
    const sizeMul = SIZES.find((s) => s.key === size)?.multiplier ?? 1;
    const addonsCost = addons.reduce((sum, a) => {
      const ad = ADDONS.find((x) => x.key === a);
      return sum + (ad?.price || 0);
    }, 0);
    return Math.round(basePrice * sizeMul + addonsCost);
  }, [basePrice, item, size, addons]);

  if (!open || !item) return null;

  const toggleAddon = (key) => {
    setAddons((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const submit = () => {
    onConfirm({
      size,
      addons: [...addons].sort(),
      unitPrice,
    });
  };

  const safeImage = item.image ? encodeURI(item.image) : "";

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div
        className="custom-modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* MODAL HEADER */}
        <div className="custom-modal-header">
          <div className="modal-item-preview">
            <img
              src={safeImage}
              alt={item.name}
              className="modal-thumb-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
              }}
            />
            <div className="modal-title-block">
              <div className="modal-diet-row">
                <div className={`diet-indicator ${item.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                  <span className="diet-dot" />
                </div>
                <span className="modal-cat-name">{item.category}</span>
              </div>
              <h2 className="modal-dish-name">{item.name}</h2>
              <span className="modal-base-price">Base price: ₹{item.price}</span>
            </div>
          </div>

          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="custom-modal-body">
          {/* SECTION 1: SIZE SELECTION */}
          <div className="modal-opt-section">
            <div className="section-title-row">
              <h3>1. Choose Portion Size</h3>
              <span className="required-pill">Required</span>
            </div>

            <div className="sizes-options-grid">
              {SIZES.map((s) => {
                const sPrice = Math.round(basePrice * s.multiplier);
                const isSelected = size === s.key;
                return (
                  <label
                    key={s.key}
                    className={`size-card-option ${isSelected ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="size-choice"
                      value={s.key}
                      checked={isSelected}
                      onChange={() => setSize(s.key)}
                      className="sr-only"
                    />
                    <div className="size-option-radio">
                      {isSelected ? <div className="radio-inner-dot" /> : null}
                    </div>
                    <div className="size-option-details">
                      <span className="size-name">{s.label}</span>
                      <span className="size-serves">{s.desc}</span>
                    </div>
                    <span className="size-calculated-price">₹{sPrice}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: ADD-ONS SELECTION */}
          <div className="modal-opt-section">
            <div className="section-title-row">
              <h3>2. Choose Delicious Add-ons</h3>
              <span className="optional-pill">Optional</span>
            </div>

            <div className="addons-options-grid">
              {ADDONS.map((a) => {
                const isChecked = addons.includes(a.key);
                return (
                  <label
                    key={a.key}
                    className={`addon-card-option ${isChecked ? "checked" : ""}`}
                  >
                    <input
                      type="checkbox"
                      value={a.key}
                      checked={isChecked}
                      onChange={() => toggleAddon(a.key)}
                      className="sr-only"
                    />
                    <div className={`addon-checkbox-box ${isChecked ? "checked" : ""}`}>
                      {isChecked && <Check size={14} color="#ffffff" strokeWidth={3} />}
                    </div>
                    <span className="addon-name-label">{a.label}</span>
                    <span className="addon-price-label">
                      {a.price > 0 ? `+₹${a.price}` : "FREE"}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="custom-modal-footer">
          <div className="modal-total-price-block">
            <span className="total-subtext">Calculated Total</span>
            <div className="total-main-price">
              <span className="sym">₹</span>
              <span className="amount">{unitPrice}</span>
            </div>
          </div>

          <div className="modal-footer-actions">
            <button className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-modal-confirm" onClick={submit}>
              <ShoppingBag size={17} />
              <span>Add to Cart (₹{unitPrice})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
