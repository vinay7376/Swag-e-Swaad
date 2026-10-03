import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  LogOut,
  Sun,
  Moon,
  Menu as MenuIcon,
  X,
  ShieldAlert,
} from "lucide-react";

export default function Navbar({
  cartCount,
  theme,
  setTheme,
  user,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const closeMobile = () => setMobileMenuOpen(false);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="modern-navbar-wrapper">
      <div className="navbar-container container">
        {/* BRAND LOGO */}
        <Link to="/" className="modern-brand" onClick={closeMobile}>
          <div className="brand-logo-icon">
            <span>🍽️</span>
          </div>
          <div className="brand-text-block">
            <span className="brand-title">Swag-e-Swaad</span>
            <span className="brand-motto">Fresh & Fast</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="desktop-nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
          >
            <span>Menu</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
          >
            <span>Favorites</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) => `nav-pill nav-cart-pill ${isActive ? "active" : ""}`}
          >
            <ShoppingBag size={17} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="navbar-cart-badge">{cartCount}</span>
            )}
          </NavLink>

          {user && (
            <NavLink
              to="/orders"
              className={({ isActive }) => `nav-pill ${isActive ? "active" : ""}`}
            >
              <Package size={16} />
              <span>My Orders</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-pill admin-nav-pill ${isActive ? "active" : ""}`}
            >
              <ShieldAlert size={15} />
              <span>Admin</span>
            </NavLink>
          )}
        </nav>

        {/* RIGHT ACTION BUTTONS */}
        <div className="navbar-right-actions">
          {/* THEME TOGGLE BUTTON */}
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} className="theme-icon sun-icon" /> : <Moon size={18} className="theme-icon moon-icon" />}
          </button>

          {user ? (
            <div className="user-nav-profile">
              <Link to="/profile" className="user-profile-chip" title="View Profile">
                <div className="user-avatar-badge">{userInitial}</div>
                <span className="user-name-text">{user.name.split(" ")[0]}</span>
              </Link>

              <button
                className="btn-nav-logout"
                onClick={onLogout}
                title="Log out"
              >
                <LogOut size={16} />
                <span className="hide-on-sm">Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-nav-buttons">
              <Link to="/login" className="btn-nav-login">
                Log In
              </Link>
              <Link to="/signup" className="btn-nav-signup">
                Sign Up
              </Link>
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU */}
      {mobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          <NavLink to="/" end className="mobile-link" onClick={closeMobile}>
            Home
          </NavLink>
          <NavLink to="/menu" className="mobile-link" onClick={closeMobile}>
            Menu
          </NavLink>
          <NavLink to="/favorites" className="mobile-link" onClick={closeMobile}>
            Favorites
          </NavLink>
          <NavLink to="/cart" className="mobile-link" onClick={closeMobile}>
            Cart ({cartCount})
          </NavLink>

          {user ? (
            <>
              <NavLink to="/orders" className="mobile-link" onClick={closeMobile}>
                My Orders
              </NavLink>
              <NavLink to="/profile" className="mobile-link" onClick={closeMobile}>
                Profile ({user.name})
              </NavLink>
              {user.role === "admin" && (
                <NavLink to="/admin" className="mobile-link" onClick={closeMobile}>
                  Admin Panel
                </NavLink>
              )}
              <button
                className="mobile-link mobile-logout-btn"
                onClick={() => {
                  closeMobile();
                  onLogout();
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="mobile-link" onClick={closeMobile}>
                Log In
              </NavLink>
              <NavLink to="/signup" className="mobile-link" onClick={closeMobile}>
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      )}
    </header>
  );
}
