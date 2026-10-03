import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-wrapper">
        {/* Brand and tagline */}
        <div className="footer-brand">
          <h2 className="footer-logo">
            🍽️ <span>Swag-e-Swaad</span>
          </h2>
          <p className="footer-tagline">Delicious food, delivered fast.</p>
        </div>

        {/* Social Icons */}
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook size={20} /></a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter"><FaTwitter size={20} /></a>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube"><FaYoutube size={20} /></a>
        </div>

        {/* Links */}
        <div className="footer-links">
          <Link to="/menu">Menu</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/menu">About</Link>
          <Link to="/menu">Contact</Link>
        </div>

        {/* Copyright */}
        <div className="footer-copy">
          © {new Date().getFullYear()} Swag-e-Swaad. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
