import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <header className="hero hero-pro">
        <div className="container hero-inner">
          <div className="hero-badge">FAST • FRESH • AFFORDABLE</div>
          <h1>
            Delicious food, delivered <span className="brand-text">fast</span>.
          </h1>
          <p>
            Explore curated dishes, snacks, and beverages. Freshly prepared, pocket‑friendly, and delivered with care.
          </p>
          <div className="hero-cta">
            <Link to="/menu" className="btn btn-primary">Explore Menu</Link>
            <Link to="/favorites" className="btn btn-ghost">Your Favorites</Link>
          </div>
        </div>

        {/* Decorative wave */}
        <svg className="hero-wave" viewBox="0 0 1440 180" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,96L80,96C160,96,320,96,480,112C640,128,800,160,960,160C1120,160,1280,128,1360,112L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" fill="url(#g)" fillOpacity="0.6"></path>
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="hsl(var(--brand-h) var(--brand-s) calc(var(--brand-l) + 8%))" />
              <stop offset="100%" stopColor="hsl(var(--brand-h) 90% 85%)" />
            </linearGradient>
          </defs>
        </svg>

        {/* floating blobs */}
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
      </header>

      <section className="stats container">
        <div className="stat">
          <strong>50+</strong>
          <span>Curated Dishes</span>
        </div>
        <div className="stat">
          <strong>4.5★</strong>
          <span>Average Rating</span>
        </div>
        <div className="stat">
          <strong>30 min</strong>
          <span>Avg Delivery</span>
        </div>
      </section>

      <section className="cats container">
        <div className="cat-pill">🍕 Pizza</div>
        <div className="cat-pill">🍔 Burgers</div>
        <div className="cat-pill">🥗 Salads</div>
        <div className="cat-pill">🥘 Indian</div>
        <div className="cat-pill">🍛 Rice</div>
        <div className="cat-pill">🍟 Snacks</div>
        <div className="cat-pill">🥤 Drinks</div>
        <div className="cat-pill">🍝 Pasta</div>
      </section>
    </>
  );
}
