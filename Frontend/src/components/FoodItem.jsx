import React, { useState } from "react";
import { useToast } from "./Toast";
import CustomizeModal from "./CustomizeModal";
import { Star, SlidersHorizontal, Plus, Heart, Flame } from "lucide-react";

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
    push({ message: `Added ${item.name} to cart`, variant: "success" });
  };

  const fav = isFav ? isFav(item._id) : false;

  const handleConfirm = (config) => {
    onAddConfigured(item, config);
    setOpen(false);
    const size = config.size;
    const addonsTxt = config.addons?.length ? ` +${config.addons.length} add-on(s)` : "";
    push({ message: `Added ${item.name} (${size})${addonsTxt}`, variant: "success" });
  };

  // Determine highlight tag (Bestseller, Chef's Special, etc.)
  const specialTag = item.tags?.find((t) =>
    ["Bestseller", "Chef's Special", "Popular", "Spicy"].includes(t)
  );

  const safeImage = item.image ? encodeURI(item.image) : "";

  return (
    <>
      <div className={`modern-food-card ${!item.isAvailable ? "card-sold-out" : ""}`}>
        {/* Media / Image Container */}
        <div className="card-media">
          <img
            loading="lazy"
            src={safeImage}
            alt={item.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
            }}
          />

          {/* Overlay gradient for contrast */}
          <div className="card-image-gradient" />

          {/* Special badge tag (top-left) */}
          {specialTag && (
            <div className={`badge-pill ${specialTag === "Bestseller" ? "pill-bestseller" : "pill-special"}`}>
              {specialTag === "Bestseller" && <Flame size={12} />}
              <span>{specialTag}</span>
            </div>
          )}

          {/* Favorite button (top-right) */}
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
              <Heart size={16} fill={fav ? "#ef4444" : "none"} color={fav ? "#ef4444" : "#ffffff"} />
            </button>
          )}

          {/* Rating floating pill */}
          <div className="card-rating-pill">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span>{Number(item.rating || 4.5).toFixed(1)}</span>
          </div>
        </div>

        {/* Food Content */}
        <div className="food-content">
          <div className="food-header-row">
            {/* Swiggy/Zomato style Veg / Non-Veg Indicator */}
            <div
              className={`diet-indicator ${item.isVeg ? "diet-veg" : "diet-nonveg"}`}
              title={item.isVeg ? "Pure Veg" : "Non-Veg"}
            >
              <span className="diet-dot" />
            </div>

            <span className="food-category-tag">{item.category}</span>
          </div>

          <h3 className="food-name" title={item.name}>{item.name}</h3>

          <p className="food-desc">
            {item.description || "Freshly cooked with authentic spices and delivered hot."}
          </p>

          {!item.isAvailable && (
            <span className="badge-unavailable">Currently Sold Out</span>
          )}

          {/* Footer: Price & Actions */}
          <div className="food-card-bottom">
            <div className="price-block">
              <span className="currency-symbol">₹</span>
              <span className="price-amount">{item.price}</span>
            </div>

            <div className="card-btn-group">
              {inCartQty > 0 ? (
                <div className="in-cart-indicator">
                  <span>In Cart ({inCartQty})</span>
                </div>
              ) : (
                <button
                  className="btn-quick-add"
                  onClick={handleAdd}
                  disabled={!item.isAvailable}
                  title="Quick add standard size"
                >
                  <Plus size={15} />
                  <span>Add</span>
                </button>
              )}

              <button
                className="btn-customize"
                onClick={() => setOpen(true)}
                disabled={!item.isAvailable}
                title="Customize size & toppings"
              >
                <SlidersHorizontal size={13} />
                <span>Custom</span>
              </button>
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
