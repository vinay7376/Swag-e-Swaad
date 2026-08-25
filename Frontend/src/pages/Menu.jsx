// src/pages/Menu.jsx

import React, { useEffect, useMemo, useState } from "react";
import FoodItem from "../components/FoodItem";
import { api } from "../services/api";

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
  const [foodItems, setFoodItems] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const [onlyFavs, setOnlyFavs] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

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
      } catch (error) {
        console.error("Fetch Foods Error:", error);
        setError(
          error.message || "Unable to load food items."
        );
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
    return [
      "All",
      ...Array.from(
        new Set(
          foodItems
            .map((food) => food.category)
            .filter(Boolean)
        )
      ),
    ];
  }, [foodItems]);

  // =========================
  // FILTER + SORT
  // =========================
  const filtered = useMemo(() => {
    let list = [...foodItems];

    // Search
    if (search.trim()) {
      const query = search.toLowerCase().trim();

      list = list.filter((food) =>
        food.name?.toLowerCase().includes(query)
      );
    }

    // Category
    if (category !== "All") {
      list = list.filter(
        (food) => food.category === category
      );
    }

    // Veg only
    if (vegOnly) {
      list = list.filter(
        (food) => food.isVeg === true
      );
    }

    // Max price
    list = list.filter(
      (food) => Number(food.price) <= maxPrice
    );

    // Minimum rating
    list = list.filter(
      (food) => Number(food.rating || 0) >= minRating
    );

    // Favorites
    if (onlyFavs) {
      list = list.filter(
        (food) =>
          isFav &&
          isFav(food._id)
      );
    }

    // Sorting
    if (sortBy === "price_low") {
      list.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    }

    if (sortBy === "price_high") {
      list.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    }

    if (sortBy === "popularity") {
      list.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
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
  const paginated = filtered.slice(
    0,
    page * ITEMS_PER_PAGE
  );

  const hasMore =
    filtered.length > paginated.length;

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [
    search,
    category,
    vegOnly,
    sortBy,
    maxPrice,
    minRating,
    onlyFavs,
  ]);

  return (
    <div className="menu-page container">

      {/* =========================
          FILTERS
      ========================= */}
      <div className="filters sticky-filters">

        <input
          type="text"
          placeholder="Search dishes..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          aria-label="Search dishes"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          aria-label="Category filter"
        >
          {categories.map((itemCategory) => (
            <option
              key={itemCategory}
              value={itemCategory}
            >
              {itemCategory}
            </option>
          ))}
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) =>
              setVegOnly(e.target.checked)
            }
          />
          Veg only
        </label>

        <select
          value={sortBy}
          onChange={(e) =>
            setSortBy(e.target.value)
          }
          aria-label="Sort by"
        >
          <option value="popularity">
            Sort: Popularity
          </option>

          <option value="price_low">
            Sort: Price (Low → High)
          </option>

          <option value="price_high">
            Sort: Price (High → Low)
          </option>
        </select>

        <label className="range">
          Max Price: ₹{maxPrice}

          <input
            type="range"
            min="50"
            max="600"
            step="10"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(Number(e.target.value))
            }
          />
        </label>

        <label className="range">
          Min Rating: {minRating}★

          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={minRating}
            onChange={(e) =>
              setMinRating(Number(e.target.value))
            }
          />
        </label>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={onlyFavs}
            onChange={(e) =>
              setOnlyFavs(e.target.checked)
            }
          />

          Favorites only ❤️
        </label>
      </div>

      {/* =========================
          ERROR
      ========================= */}
      {error && (
        <div className="empty">
          <h3>Unable to load food items</h3>

          <p className="muted">
            {error}
          </p>

          <p className="muted">
            Please make sure the backend server
            is running on port 5000.
          </p>
        </div>
      )}

      {/* =========================
          FOOD GRID
      ========================= */}
      {!error && (
        <div className="menu-grid">

          {loading &&
            Array.from({ length: 8 }).map(
              (_, index) => (
                <SkeletonCard
                  key={index}
                />
              )
            )}

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
                onAddConfigured={
                  addConfiguredToCart
                }
              />
            ))}
        </div>
      )}

      {/* =========================
          LOAD MORE
      ========================= */}
      {!loading &&
        !error &&
        hasMore && (
          <div
            style={{
              textAlign: "center",
              margin: "20px 0",
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() =>
                setPage((currentPage) =>
                  currentPage + 1
                )
              }
            >
              Load More
            </button>
          </div>
        )}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading &&
        !error &&
        filtered.length === 0 && (
          <div className="empty">
            <div className="empty-ill" />

            <h3>No items found</h3>

            <p className="muted">
              Try changing filters or search term.
            </p>
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
    <div className="food-card skeleton">

      <div className="skeleton-media" />

      <div className="food-content">

        <div
          className="skeleton-line"
          style={{ width: "70%" }}
        />

        <div
          className="skeleton-line"
          style={{ width: "50%" }}
        />

        <div className="food-footer">
          <div className="skeleton-chip" />
          <div className="skeleton-qty" />
        </div>

      </div>
    </div>
  );
}