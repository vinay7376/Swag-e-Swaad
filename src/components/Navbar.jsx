import React from "react";
import { NavLink, Link } from "react-router-dom";

export default function Navbar({ cartCount, theme, setTheme, user, onLogout }) {
  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="brand">
          <span className="brand-badge">🍽</span>
          <span>Swag-e-Swaad </span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Home</NavLink>
          <NavLink to="/menu" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Menu</NavLink>
          <NavLink to="/favorites" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Favorites</NavLink>
          <NavLink to="/cart" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>
            Cart {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </NavLink>

          {user ? (
            <>
              <span className="nav-link">Hi, {user.name}</span>
              <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Login</NavLink>
              <NavLink to="/signup" className={({isActive}) => `nav-link ${isActive ? "active" : ""}`}>Sign up</NavLink>
            </>
          )}

          <button className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </nav>
  );
}
