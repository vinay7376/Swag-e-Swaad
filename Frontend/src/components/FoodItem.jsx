import React, { useState } from "react";
import { useToast } from "./Toast";
import CustomizeModal from "./CustomizeModal";

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const arr = Array.from({ length: 5 }, (_, i) => {
    if (i < full) return "★";
    if (i === full && half) return "☆";
    return "☆";
  });
  return <span aria-label={`Rating ${value}`}> {arr.join(" ")} </span>;
}

function FoodItem({
  item,
  inCartQty,
  onAdd,
  onIncrease,
  onDecrease,
  isFav,
  onToggleFav,
  onAddConfigured,
}) {
  const { push } = useToast();
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    onAdd(item);
    push({ message: `Added ${item.name} (M) to cart`, variant: "success" });
  };

  const fav = isFav ? isFav(item._id) : false;

  const handleConfirm = (config) => {
    onAddConfigured(item, config);
    setOpen(false);
    const size = config.size;
    const addonsTxt = config.addons?.length ? ` +${config.addons.length} add-on(s)` : "";
    push({ message: `Added ${item.name} (${size})${addonsTxt}`, variant: "success" });
  };

  return (
    <>
      <div className="food-card hoverable">
        <div className="card-media">
          <img loading="lazy" src={item.image} alt={item.name} />
          {item.tags?.length > 0 && <div className="ribbon">{item.tags[0]}</div>}

          {onToggleFav && (
            <button
              className={`fav-btn ${fav ? "active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFav(item._id);
              }}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              title={fav ? "Remove from favorites" : "Add to favorites"}
            >
              {fav ? "❤️" : "🤍"}
            </button>
          )}
        </div>

        <div className="food-content">
          <h3>{item.name}</h3>
          <p className="muted">
            {item.category} • {item.isVeg ? "🌱 Veg" : "🍗 Non-Veg"} •{" "}
            <Stars value={item.rating} />
          </p>
          {!item.isAvailable && <p className="muted">Currently unavailable</p>}

          <div className="food-footer">
            <span className="price">₹{item.price}</span>

            <div style={{ display: "flex", gap: 8 }}>
              {inCartQty > 0 ? (
                <div className="qty-controls">
                  {/* NOTE: variant-aware qty buttons are on Cart page; here we show total qty only */}
                  <span>In cart: {inCartQty}</span>
                </div>
              ) : (
                <button className="prime" onClick={handleAdd} disabled={!item.isAvailable}>Quick Add</button>
              )}
              <button className="coustomizes" onClick={() => setOpen(true)} disabled={!item.isAvailable}>Customize</button>
            </div>
          </div>
        </div>
      </div>

      <CustomizeModal
        open={open}
        onClose={() => setOpen(false)}
        item={item}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default FoodItem;
