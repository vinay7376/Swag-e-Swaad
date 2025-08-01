import React from "react";
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
          <a href="#"><FaFacebook size={20} /></a>
          <a href="#"><FaInstagram size={20} /></a>
          <a href="#"><FaTwitter size={20} /></a>
          <a href="#"><FaYoutube size={20} /></a>
        </div>

        {/* Links */}
        <div className="footer-links">
          <a href="/menu">Menu</a>
          <a href="/favorites">Favorites</a>
          <a href="/cart">Cart</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">FAQ</a>
        </div>

        {/* Copyright */}
        <div className="footer-copy">
          © {new Date().getFullYear()} FoodieZone. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
