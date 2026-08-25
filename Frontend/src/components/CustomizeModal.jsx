import React, { useMemo, useState } from "react";

const SIZES = [
  { key: "S", label: "Small", multiplier: 1.0 },
  { key: "M", label: "Medium", multiplier: 1.2 },
  { key: "L", label: "Large", multiplier: 1.5 },
];

const ADDONS = [
  { key: "cheese", label: "Extra Cheese", price: 30 },
  { key: "toppings", label: "Extra Toppings", price: 40 },
  { key: "spicy", label: "Extra Spicy", price: 0 },
];

export default function CustomizeModal({ open, onClose, item, onConfirm }) {
  const [size, setSize] = useState("M");
  const [addons, setAddons] = useState([]);

  const unitPrice = useMemo(() => {
    if (!item) return 0;
    const sizeMul = SIZES.find((s) => s.key === size)?.multiplier ?? 1;
    const addonsCost = addons.reduce((sum, a) => {
      const ad = ADDONS.find((x) => x.key === a);
      return sum + (ad?.price || 0);
    }, 0);
    return Math.round(item.price * sizeMul + addonsCost);
  }, [item, size, addons]);

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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h3>Customize: {item.name}</h3>
          <button className="modal-x" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-section">
            <h4>Size</h4>
            <div className="size-grid">
              {SIZES.map((s) => (
                <label key={s.key} className={`size-pill ${size === s.key ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="size"
                    value={s.key}
                    checked={size === s.key}
                    onChange={() => setSize(s.key)}
                  />
                  {s.label} ({s.key})
                </label>
              ))}
            </div>
          </div>

          <div className="modal-section">
            <h4>Add-ons</h4>
            <div className="addons-grid">
              {ADDONS.map((a) => (
                <label key={a.key} className={`addon-chip ${addons.includes(a.key) ? "active" : ""}`}>
                  <input
                    type="checkbox"
                    value={a.key}
                    checked={addons.includes(a.key)}
                    onChange={() => toggleAddon(a.key)}
                  />
                  {a.label} {a.price ? `+₹${a.price}` : ""}
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <div className="price-preview">Price: <strong>₹{unitPrice}</strong></div>
            <div className="actions"style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button className="btn-ghoest" onClick={onClose}>Cancel</button>
              <button className="btn-custom" onClick={submit}>Add to Cart</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
