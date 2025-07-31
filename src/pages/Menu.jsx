// src/pages/Menu.jsx
import React, { useEffect, useMemo, useState } from "react";
import foodItems from "../data/foodItems";
import FoodItem from "../components/FoodItem";

const ITEMS_PER_PAGE = 8;

export default function Menu({
  cart,
  getQtyForId,
  addToCart,
  addConfiguredToCart,
  increaseQty,
  decreaseQty,
  isFav,
  toggleFav,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // mimic API delay
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  // unique categories list
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(foodItems.map((f) => f.category)))],
    []
  );

  // filter + sort
  const filtered = useMemo(() => {
    let list = [...foodItems];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    if (category !== "All") list = list.filter((f) => f.category === category);
    if (vegOnly) list = list.filter((f) => f.isVeg);
    list = list.filter((f) => f.price <= maxPrice);
    list = list.filter((f) => f.rating >= minRating);
    if (onlyFavs) list = list.filter((f) => isFav && isFav(f.id));

    if (sortBy === "price_low") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "popularity") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [search, category, vegOnly, sortBy, maxPrice, minRating, onlyFavs, isFav]);

  // pagination
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = filtered.length > paginated.length;

  // reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, vegOnly, sortBy, maxPrice, minRating, onlyFavs]);

  return (
    <div className="menu-page container">
      {/* Sticky Filters */}
      <div className="filters sticky-filters">
        <input
          type="text"
          placeholder="Search dishes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search dishes"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Category filter"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
          />
          Veg only
        </label>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
        >
          <option value="popularity">Sort: Popularity</option>
          <option value="price_low">Sort: Price (Low → High)</option>
          <option value="price_high">Sort: Price (High → Low)</option>
        </select>

        <label className="range" aria-label="Max price">
          Max Price: ₹{maxPrice}
          <input
            type="range"
            min="50"
            max="600"
            step="10"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </label>

        <label className="range" aria-label="Minimum rating">
          Min Rating: {minRating}★
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={onlyFavs}
            onChange={(e) => setOnlyFavs(e.target.checked)}
          />
          Favorites only ❤️
        </label>
      </div>

      {/* Grid */}
      <div className="menu-grid">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : paginated.map((item) => (
              <FoodItem
                key={item.id}
                item={item}
                inCartQty={getQtyForId ? getQtyForId(item.id) : (cart?.[item.id]?.qty || 0)}
                onAdd={addToCart}
                onIncrease={increaseQty}
                onDecrease={decreaseQty}
                isFav={isFav}
                onToggleFav={toggleFav}
                onAddConfigured={addConfiguredToCart}
              />
            ))}
      </div>

      {/* Load more */}
      {!loading && hasMore && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <button className="btn btn-primary" onClick={() => setPage((p) => p + 1)}>
            Load More
          </button>
        </div>
      )}

      {/* Empty state (when filters remove everything) */}
      {!loading && filtered.length === 0 && (
        <div className="empty">
          <div className="empty-ill" />
          <h3>No items found</h3>
          <p className="muted">Try changing filters or search term.</p>
        </div>
      )}
    </div>
  );
}

// Lightweight skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="food-card skeleton">
      <div className="skeleton-media" />
      <div className="food-content">
        <div className="skeleton-line" style={{ width: "70%" }} />
        <div className="skeleton-line" style={{ width: "50%" }} />
        <div className="food-footer">
          <div className="skeleton-chip" />
          <div className="skeleton-qty" />
        </div>
      </div>
    </div>
  );
}
