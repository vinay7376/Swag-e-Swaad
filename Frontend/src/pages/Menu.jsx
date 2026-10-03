// src/pages/Menu.jsx

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import FoodItem from "../components/FoodItem";
import { api } from "../services/api";
import { Search, RotateCcw } from "lucide-react";

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
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  // Sync category from URL param if changed externally
  useEffect(() => {
    const catFromUrl = searchParams.get("category");
    if (catFromUrl) {
      setCategory(catFromUrl);
    }
  }, [searchParams]);

  // =========================
  // FETCH FOODS
  // =========================
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api("/foods");
        setFoodItems(data.foods || []);
      } catch (err) {
        console.error("Fetch Foods Error:", err);
        setError(err.message || "Unable to load food items.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // =========================
  // UNIQUE CATEGORIES
  // =========================
  const categories = useMemo(() => {
    const set = new Set(foodItems.map((food) => food.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [foodItems]);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    if (cat === "All") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: cat });
    }
  };

  const handleResetFilters = () => {
    setSearch("");
    setCategory("All");
    setVegOnly(false);
    setSortBy("popularity");
    setMaxPrice(500);
    setMinRating(0);
    setOnlyFavs(false);
    setSearchParams({});
  };

  const hasActiveFilters = search || category !== "All" || vegOnly || sortBy !== "popularity" || maxPrice < 500 || minRating > 0 || onlyFavs;

  // =========================
  // FILTER + SORT
  // =========================
  const filtered = useMemo(() => {
    let list = [...foodItems];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();
      list = list.filter(
        (food) =>
          food.name?.toLowerCase().includes(query) ||
          food.description?.toLowerCase().includes(query) ||
          food.category?.toLowerCase().includes(query)
      );
    }

    // Category
    if (category !== "All") {
      list = list.filter((food) => food.category === category);
    }

    // Veg only
    if (vegOnly) {
      list = list.filter((food) => food.isVeg === true);
    }

    // Max price
    list = list.filter((food) => Number(food.price) <= maxPrice);

    // Minimum rating
    list = list.filter((food) => Number(food.rating || 0) >= minRating);

    // Favorites
    if (onlyFavs) {
      list = list.filter((food) => isFav && isFav(food._id));
    }

    // Sorting
    if (sortBy === "price_low") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_high") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "popularity") {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    }

    return list;
  }, [
    foodItems,
    search,
    category,
    vegOnly,
    sortBy,
    maxPrice,
    minRating,
    onlyFavs,
    isFav,
  ]);

  // =========================
  // PAGINATION
  // =========================
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = filtered.length > paginated.length;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, category, vegOnly, sortBy, maxPrice, minRating, onlyFavs]);

  return (
    <div className="menu-page container">
      {/* Header section with category tabs */}
      <div className="menu-page-header">
        <div>
          <h1 className="menu-heading">Explore Our Menu 🍴</h1>
          <p className="menu-subheading">
            Authentic flavours crafted with fresh ingredients, delivered blazing fast to your door.
          </p>
        </div>

        {/* Quick Category Pills Bar */}
        <div className="category-scroll-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill-btn ${category === cat ? "active" : ""}`}
              onClick={() => handleCategorySelect(cat)}
            >
              {cat === "All" && "✨ "}
              {cat === "Pizza" && "🍕 "}
              {cat === "Burgers" && "🍔 "}
              {cat === "Biryani" && "🍚 "}
              {cat === "Starters" && "🍗 "}
              {cat === "Snacks" && "🥖 "}
              {cat === "Desserts" && "🍰 "}
              {cat === "Beverages" && "🥤 "}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* =========================
          FILTERS BAR
      ========================= */}
      <div className="filters-card sticky-filters">
        <div className="filters-top-row">
          {/* Search Input */}
          <div className="search-input-wrap">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search dishes, burgers, biryani..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search dishes"
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>

          {/* Quick Veg Filter Toggle */}
          <button
            className={`veg-toggle-btn ${vegOnly ? "active" : ""}`}
            onClick={() => setVegOnly(!vegOnly)}
          >
            <span className="veg-pill-dot" />
            <span>Veg Only</span>
          </button>

          {/* Favorites Filter */}
          <button
            className={`fav-toggle-btn ${onlyFavs ? "active" : ""}`}
            onClick={() => setOnlyFavs(!onlyFavs)}
          >
            <span>❤️ Favorites</span>
          </button>

          {/* Sort Dropdown */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort by"
          >
            <option value="popularity">⭐ Top Rated</option>
            <option value="price_low">₹ Price: Low to High</option>
            <option value="price_high">₹ Price: High to Low</option>
          </select>

          {hasActiveFilters && (
            <button
              className="btn-reset-filters"
              onClick={handleResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Sliders Row */}
        <div className="filters-sliders-row">
          <div className="slider-group">
            <div className="slider-label-row">
              <span>Max Price</span>
              <strong>₹{maxPrice}</strong>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>Min Rating</span>
              <strong>{minRating > 0 ? `${minRating}★+` : "All"}</strong>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
            />
          </div>

          <div className="items-count-badge">
            <span>Showing <strong>{filtered.length}</strong> items</span>
          </div>
        </div>
      </div>

      {/* =========================
          ERROR STATE
      ========================= */}
      {error && (
        <div className="empty-state-box">
          <h3>Unable to load menu</h3>
          <p className="muted">{error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {/* =========================
          FOOD GRID
      ========================= */}
      {!error && (
        <div className="menu-grid">
          {loading &&
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}

          {!loading &&
            paginated.map((item) => (
              <FoodItem
                key={item._id}
                item={item}
                inCartQty={
                  getQtyForId
                    ? getQtyForId(item._id)
                    : cart?.[item._id]?.qty || 0
                }
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

      {/* =========================
          LOAD MORE
      ========================= */}
      {!loading && !error && hasMore && (
        <div style={{ textAlign: "center", margin: "36px 0 20px" }}>
          <button
            className="btn btn-primary load-more-btn"
            onClick={() => setPage((currentPage) => currentPage + 1)}
          >
            Load More Dishes ({filtered.length - paginated.length} remaining)
          </button>
        </div>
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading && !error && filtered.length === 0 && (
        <div className="empty-state-box">
          <div className="empty-emoji">🍽️</div>
          <h3>No matching dishes found</h3>
          <p className="muted">
            We couldn't find anything matching your filters. Try clearing your search or filters!
          </p>
          <button className="btn btn-primary" onClick={handleResetFilters} style={{ marginTop: 12 }}>
            View All Dishes
          </button>
        </div>
      )}
    </div>
  );
}

// =========================
// SKELETON CARD
// =========================
function SkeletonCard() {
  return (
    <div className="food-card skeleton-card">
      <div className="skeleton-media" />
      <div className="food-content">
        <div className="skeleton-line" style={{ width: "35%", height: 14 }} />
        <div className="skeleton-line" style={{ width: "75%", height: 20 }} />
        <div className="skeleton-line" style={{ width: "90%", height: 14 }} />
        <div className="skeleton-footer">
          <div className="skeleton-line" style={{ width: "30%", height: 22 }} />
          <div className="skeleton-line" style={{ width: "40%", height: 32 }} />
        </div>
      </div>
    </div>
  );
}