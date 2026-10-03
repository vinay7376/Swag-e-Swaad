import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import {
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  Clock,
  Flame,
  Copy,
  Star,
  Plus,
  UtensilsCrossed,
} from "lucide-react";

export default function Home({ foods = [], addToCart, getQtyForId }) {
  const { push } = useToast();
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/menu?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate("/menu");
    }
  };

  const copyCoupon = (code) => {
    navigator.clipboard?.writeText(code);
    push({
      message: `Coupon code ${code} copied to clipboard!`,
      variant: "success",
    });
  };

  // Top categories with icons & descriptions
  const categories = [
    { name: "Pizza", icon: "🍕", label: "Pizzas", desc: "Cheesy & Crispy" },
    { name: "Biryani", icon: "🍚", label: "Dum Biryani", desc: "Fragrant & Royal" },
    { name: "Burgers", icon: "🍔", label: "Burgers", desc: "Juicy & Crunchy" },
    { name: "Starters", icon: "🍗", label: "Starters", desc: "Smoky & Tandoori" },
    { name: "Snacks", icon: "🥖", label: "Snacks", desc: "Quick Bites" },
    { name: "Desserts", icon: "🍰", label: "Desserts", desc: "Sweet Indulgence" },
    { name: "Beverages", icon: "🥤", label: "Beverages", desc: "Chilled & Refreshing" },
  ];

  // Pick top 4 featured dishes (from props or default list)
  const featuredDishes = foods.length > 0
    ? foods.slice(0, 4)
    : [
        {
          _id: "f1",
          name: "Chicken Dum Biryani",
          category: "Biryani",
          isVeg: false,
          price: 289,
          rating: 4.9,
          image: "/assets/Chicken Biryani.png",
          description: "Royal slow-cooked basmati rice infused with aromatic saffron & tender spiced chicken.",
        },
        {
          _id: "f2",
          name: "Margherita Pizza",
          category: "Pizza",
          isVeg: true,
          price: 299,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=600&auto=format&fit=crop&q=80",
          description: "Classic cheesy delight loaded with 100% mozzarella, fresh basil & herb tomato sauce.",
        },
        {
          _id: "f3",
          name: "Chicken Tikka",
          category: "Starters",
          isVeg: false,
          price: 269,
          rating: 4.8,
          image: "/assets/Chicken Tikka.png",
          description: "Juicy boneless chicken marinated in yogurt & tandoori spices, char-grilled to perfection.",
        },
        {
          _id: "f4",
          name: "Cheese Garlic Bread",
          category: "Snacks",
          isVeg: true,
          price: 149,
          rating: 4.5,
          image: "/assets/Cheese Garlic Bread.png",
          description: "Freshly baked artisan baguette brushed with herb garlic butter & bubbling mozzarella.",
        },
      ];

  const testimonials = [
    {
      name: "Aman Sharma",
      role: "Regular Customer",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "The Chicken Dum Biryani and Garlic Bread were piping hot! Delivered in just 24 minutes. Best food delivery in our city.",
    },
    {
      name: "Priya Verma",
      role: "Food Enthusiast",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Super fresh, perfectly spiced pizza. The crust was crisp and the cheese pull was unbelievable. 10/10 recommend!",
    },
    {
      name: "Rohit Patel",
      role: "Verified Foodie",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80",
      rating: 5,
      comment: "Smooth checkout with UPI, tracking was accurate, and the packaging was eco-friendly and leak-proof. Love the swag!",
    },
  ];

  return (
    <div className="home-wrapper">
      {/* =========================================
          HERO SECTION
      ========================================= */}
      <section className="home-hero-section">
        <div className="container home-hero-grid">
          {/* Left Text Column */}
          <div className="home-hero-left">
            <div className="hero-pill-badge">
              <Sparkles size={15} className="sparkle-icon" />
              <span>SUPER FAST 30-MIN DELIVERY • SWAG GUARANTEED</span>
            </div>

            <h1 className="home-hero-title">
              Delicious Food, <br />
              Delivered <span className="gradient-text">Hot & Fresh</span>.
            </h1>

            <p className="home-hero-subtitle">
              Savor chef-curated pizzas, royal dum biryanis, crunchy burgers, and sizzling tandoori starters, prepared fresh with love and delivered in minutes.
            </p>

            {/* Quick Search Form */}
            <form className="hero-search-bar" onSubmit={handleHeroSearch}>
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search favorite dishes (e.g. Pizza, Biryani, Tikka)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">
                <span>Find Food</span>
                <ArrowRight size={16} />
              </button>
            </form>

            {/* Quick Hero Tags */}
            <div className="hero-quick-tags">
              <span className="tag-label">Popular Cuisines:</span>
              <Link to="/menu?category=Pizza" className="hero-tag">🍕 Pizza</Link>
              <Link to="/menu?category=Biryani" className="hero-tag">🍚 Biryani</Link>
              <Link to="/menu?category=Burgers" className="hero-tag">🍔 Burgers</Link>
              <Link to="/menu?category=Starters" className="hero-tag">🍗 Starters</Link>
            </div>

            {/* Clean Hero Trust Bar (30 Mins & 100% Fresh) */}
            <div className="hero-trust-bar">
              <div className="hero-trust-badge">
                <div className="trust-icon-box speed">
                  <Zap size={16} />
                </div>
                <div className="trust-badge-text">
                  <strong>30 Mins</strong>
                  <span>Lightning Delivery</span>
                </div>
              </div>

              <div className="hero-trust-badge">
                <div className="trust-icon-box fresh">
                  <ShieldCheck size={16} />
                </div>
                <div className="trust-badge-text">
                  <strong>100% Fresh</strong>
                  <span>Hygienic Kitchen</span>
                </div>
              </div>

              <div className="hero-trust-badge">
                <div className="trust-icon-box rating">
                  <Star size={16} />
                </div>
                <div className="trust-badge-text">
                  <strong>Top Rated</strong>
                  <span>4.9★ Quality Food</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Card Showcase (Unobstructed & Clean) */}
          <div className="home-hero-right">
            <div className="hero-dish-card">
              <div className="hero-dish-media">
                <img
                  src="/assets/Chicken Biryani.png"
                  alt="Special Chicken Dum Biryani"
                  className="hero-dish-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80";
                  }}
                />
                <span className="hero-float-badge float-top-left">
                  <Flame size={14} color="#f97316" />
                  <span>Chef's Choice</span>
                </span>
                <span className="hero-float-badge float-top-right">
                  <Star size={14} fill="#f59e0b" color="#f59e0b" />
                  <span>4.9 (1.2k+ reviews)</span>
                </span>
              </div>

              <div className="hero-dish-body">
                <div className="dish-meta-row">
                  <div className="diet-indicator diet-nonveg">
                    <span className="diet-dot" />
                  </div>
                  <span className="dish-cat-text">Royal Biryani</span>
                  <span className="prep-time"><Clock size={13} /> 25-30 mins</span>
                </div>

                <h3 className="hero-dish-heading">Chicken Dum Biryani</h3>
                <p className="hero-dish-desc">
                  Slow-cooked fragrant basmati rice layered with juicy chicken, caramelized mint, and saffron milk.
                </p>

                <div className="hero-dish-footer">
                  <div className="hero-dish-price">
                    <span className="sym">₹</span>
                    <span className="val">289</span>
                    <span className="old">₹349</span>
                  </div>

                  <Link to="/menu?category=Biryani" className="btn-order-dish">
                    <span>Order Now</span>
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          PROMOTIONAL OFFERS & COUPONS BANNER
      ========================================= */}
      <section className="promo-strip-section container">
        <div className="promo-banner-card">
          <div className="promo-header">
            <div className="promo-title-wrap">
              <span className="promo-badge">HOT DEALS</span>
              <h2>Exclusive Offers & Discounts 🔥</h2>
            </div>
            <p className="promo-subtitle">Apply these discount codes at checkout for instant savings on your feast!</p>
          </div>

          <div className="promo-coupons-grid">
            {/* Coupon 1 */}
            <div className="coupon-card">
              <div className="coupon-left">
                <span className="coupon-discount">10% OFF</span>
                <span className="coupon-desc">On all meals & snacks</span>
              </div>
              <div className="coupon-divider"></div>
              <button
                className="coupon-copy-btn"
                onClick={() => copyCoupon("SAVE10")}
                title="Click to copy coupon"
              >
                <code>SAVE10</code>
                <Copy size={14} />
              </button>
            </div>

            {/* Coupon 2 */}
            <div className="coupon-card">
              <div className="coupon-left">
                <span className="coupon-discount">₹50 FLAT</span>
                <span className="coupon-desc">Orders above ₹299</span>
              </div>
              <div className="coupon-divider"></div>
              <button
                className="coupon-copy-btn"
                onClick={() => copyCoupon("FLAT50")}
                title="Click to copy coupon"
              >
                <code>FLAT50</code>
                <Copy size={14} />
              </button>
            </div>

            {/* Coupon 3 */}
            <div className="coupon-card">
              <div className="coupon-left">
                <span className="coupon-discount">FREE DELIVERY</span>
                <span className="coupon-desc">Zero delivery charge</span>
              </div>
              <div className="coupon-divider"></div>
              <button
                className="coupon-copy-btn"
                onClick={() => copyCoupon("FREESHIP")}
                title="Click to copy coupon"
              >
                <code>FREESHIP</code>
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          POPULAR CATEGORIES
      ========================================= */}
      <section className="categories-section container">
        <div className="section-head">
          <span className="section-eyebrow">EXPLORE FLAVOURS</span>
          <h2 className="section-title">Popular Categories 🍽️</h2>
          <p className="section-sub">Browse by your cravings and find the perfect dish for today.</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              to={`/menu?category=${cat.name}`}
              key={cat.name}
              className="category-card"
            >
              <div className="cat-icon-bubble">{cat.icon}</div>
              <h3 className="cat-card-title">{cat.label}</h3>
              <p className="cat-card-desc">{cat.desc}</p>
              <span className="cat-card-arrow">
                Explore <ArrowRight size={13} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================
          CHEF'S TOP PICKS / FEATURED DISHES
      ========================================= */}
      <section className="featured-section container">
        <div className="section-head-between">
          <div>
            <span className="section-eyebrow">HIGHLY RECOMMENDED</span>
            <h2 className="section-title">Chef's Handpicked Specials ⭐</h2>
          </div>
          <Link to="/menu" className="btn-view-all">
            <span>View Full Menu</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="featured-grid">
          {featuredDishes.map((dish) => {
            const inCart = getQtyForId ? getQtyForId(dish._id) : 0;
            return (
              <div key={dish._id} className="featured-card">
                <div className="feat-media">
                  <img
                    src={dish.image}
                    alt={dish.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="feat-rating">
                    <Star size={13} fill="#f59e0b" color="#f59e0b" />
                    <span>{Number(dish.rating || 4.5).toFixed(1)}</span>
                  </div>
                </div>

                <div className="feat-body">
                  <div className="feat-header-row">
                    <div className={`diet-indicator ${dish.isVeg ? "diet-veg" : "diet-nonveg"}`}>
                      <span className="diet-dot" />
                    </div>
                    <span className="feat-cat">{dish.category}</span>
                  </div>

                  <h3 className="feat-title">{dish.name}</h3>
                  <p className="feat-desc">{dish.description}</p>

                  <div className="feat-footer">
                    <div className="feat-price">
                      <span className="sym">₹</span>
                      <span className="val">{dish.price}</span>
                    </div>

                    {addToCart ? (
                      <button
                        className="btn-feat-add"
                        onClick={() => {
                          addToCart(dish);
                          push({ message: `Added ${dish.name} to cart!`, variant: "success" });
                        }}
                      >
                        <Plus size={15} />
                        <span>{inCart > 0 ? `Add (${inCart})` : "Add"}</span>
                      </button>
                    ) : (
                      <Link to="/menu" className="btn-feat-add">
                        <span>Order</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================
          WHY CHOOSE US (CORE PILLARS)
      ========================================= */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-head text-center">
            <span className="section-eyebrow">THE SWAG-E-SWAAD PROMISE</span>
            <h2 className="section-title">Why Foodies Love Us 🚀</h2>
            <p className="section-sub">We don't just deliver food; we deliver happiness to your table.</p>
          </div>

          <div className="why-us-grid">
            <div className="why-card">
              <div className="why-icon-wrap icon-speed">
                <Zap size={28} />
              </div>
              <h3>30-Min Fast Delivery</h3>
              <p>Hot, steaming food brought right to your door with live GPS tracking so you're never waiting hungry.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap icon-fresh">
                <UtensilsCrossed size={28} />
              </div>
              <h3>100% Fresh & Authentic</h3>
              <p>Prepared only upon ordering with farm-fresh produce and genuine ground spices by experienced master chefs.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap icon-hygiene">
                <ShieldCheck size={28} />
              </div>
              <h3>Hygienic Tamper Packaging</h3>
              <p>Spill-proof, eco-friendly food grade containers with tamper-evident seals keep taste & aroma intact.</p>
            </div>

            <div className="why-card">
              <div className="why-icon-wrap icon-payments">
                <Award size={28} />
              </div>
              <h3>Effortless Payment Options</h3>
              <p>Convenient Cash on Delivery, instant UPI (GPay, PhonePe, Paytm), and Razorpay secure cards verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS (3 SIMPLE STEPS)
      ========================================= */}
      <section className="how-it-works container">
        <div className="section-head text-center">
          <span className="section-eyebrow">SUPER SIMPLE</span>
          <h2 className="section-title">How To Order in 3 Steps 📱</h2>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h3>Pick Your Dishes</h3>
            <p>Browse our extensive menu of pizzas, biryanis, burgers, and sides with rich veg & non-veg options.</p>
          </div>

          <div className="step-connector">➔</div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h3>Customize & Pay</h3>
            <p>Select your portion size, add extra cheese or toppings, apply coupon codes, and pay with COD or UPI.</p>
          </div>

          <div className="step-connector">➔</div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h3>Relish The Feast</h3>
            <p>Your meal arrives fresh and hot at your doorstep. Unbox, dig in, and experience authentic swag!</p>
          </div>
        </div>
      </section>

      {/* =========================================
          TESTIMONIALS / REVIEWS
      ========================================= */}
      <section className="testimonials-section container">
        <div className="section-head text-center">
          <span className="section-eyebrow">CUSTOMER STORIES</span>
          <h2 className="section-title">Loved by Thousands of Foodies ❤️</h2>
          <p className="section-sub">Don't just take our word for it — here's what our happy eaters say.</p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="test-stars">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="test-comment">"{t.comment}"</p>
              <div className="test-author">
                <img src={t.avatar} alt={t.name} className="test-avatar" />
                <div>
                  <h4 className="test-name">{t.name}</h4>
                  <span className="test-role">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================
          BOTTOM CALL TO ACTION (CTA) BANNER
      ========================================= */}
      <section className="cta-banner-section container">
        <div className="cta-card">
          <div className="cta-content">
            <span className="cta-mini">HUNGRY YET?</span>
            <h2 className="cta-title">Your Next Memorable Meal Is Just A Click Away!</h2>
            <p className="cta-desc">
              Join thousands of delighted food lovers. Order right now and get free delivery on your favorite dishes.
            </p>
            <div className="cta-btn-group">
              <Link to="/menu" className="btn-cta-primary">
                <span>Explore Full Menu</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/signup" className="btn-cta-ghost">
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
