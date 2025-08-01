// src/pages/Favorites.jsx
import React from "react";
import FoodItem from "../components/FoodItem";
import "../App.css"; // Make sure your theme variables are available

export default function Favorites({
  favIds = [],
  allItems = [],
  getQtyForId,
  addToCart,
  addConfiguredToCart,
  increaseQty,
  decreaseQty,
  isFav,
  toggleFav,
}) {
  const favoriteItems = allItems.filter((item) => favIds.includes(item.id));

  return (
    <div className="menu-page container">
      <h2 style={{ marginBottom: "20px" }}>Your Favorites ❤️</h2>

      {favoriteItems.length === 0 ? (
        <div className="empty">
          <div className="empty-ill" />
          <h3>No favorites yet</h3>
          <p className="muted">Add dishes to favorites and they’ll appear here.</p>
        </div>
      ) : (
        <div className="menu-grid">
          {favoriteItems.map((item) => (
            <FoodItem
              key={item.id}
              item={item}
              inCartQty={getQtyForId ? getQtyForId(item.id) : 0}
              onAdd={addToCart}
              onIncrease={increaseQty}
              onDecrease={decreaseQty}
              isFav={isFav}
              onToggleFav={toggleFav}
              onAddConfigured={addConfiguredToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
