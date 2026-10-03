import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { Phone, Mail, Clock, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="modern-footer-root">
      {/* Upper Footer Grid */}
      <div className="container footer-grid-container">
        {/* Brand & About */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-brand-logo">
            <span className="logo-emoji">🍽️</span>
            <span className="logo-title">Swag-e-Swaad</span>
          </Link>
          <p className="footer-about-text">
            Swag-e-Swaad brings authentic culinary delights, slow-cooked royal dum biryanis, cheesy pizzas, and crispy burgers straight from the master kitchen to your doorstep in 30 minutes.
          </p>

          <div className="footer-contact-items">
            <div className="contact-item">
              <Phone size={15} className="contact-icon" />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <Mail size={15} className="contact-icon" />
              <span>support@swageswaad.com</span>
            </div>
            <div className="contact-item">
              <Clock size={15} className="contact-icon" />
              <span>Open Daily: 10:00 AM – 11:30 PM</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3 className="footer-col-title">Quick Links</h3>
          <ul className="footer-links-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/menu">Explore Menu</Link></li>
            <li><Link to="/orders">My Orders</Link></li>
            <li><Link to="/favorites">My Favorites</Link></li>
            <li><Link to="/cart">Shopping Cart</Link></li>
            <li><Link to="/profile">My Account</Link></li>
          </ul>
        </div>

        {/* Top Cuisines */}
        <div className="footer-col links-col">
          <h3 className="footer-col-title">Popular Cuisines</h3>
          <ul className="footer-links-list">
            <li><Link to="/menu?category=Pizza">Cheesy Pizzas</Link></li>
            <li><Link to="/menu?category=Biryani">Royal Dum Biryanis</Link></li>
            <li><Link to="/menu?category=Burgers">Juicy Burgers</Link></li>
            <li><Link to="/menu?category=Starters">Tandoori Starters</Link></li>
            <li><Link to="/menu?category=Snacks">Crispy Snacks & Breads</Link></li>
            <li><Link to="/menu?category=Desserts">Molten Desserts</Link></li>
          </ul>
        </div>

        {/* Social & Badges */}
        <div className="footer-col social-col">
          <h3 className="footer-col-title">Connect & Follow</h3>
          <p className="footer-social-desc">
            Follow us on social media for exclusive chef secret recipes, festive discounts & giveaways!
          </p>

          <div className="footer-social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-bubble" aria-label="Facebook">
              <FaFacebookF size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-bubble" aria-label="Instagram">
              <FaInstagram size={16} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-bubble" aria-label="Twitter">
              <FaTwitter size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-bubble" aria-label="YouTube">
              <FaYoutube size={16} />
            </a>
          </div>

          <div className="payment-security-badge">
            <span className="safe-pay-title">🔒 100% Safe & Secure Checkout</span>
            <div className="safe-pay-tags">
              <span>UPI</span>
              <span>Cards</span>
              <span>NetBanking</span>
              <span>COD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="container footer-bottom-inner">
          <p>© {new Date().getFullYear()} Swag-e-Swaad. All rights reserved.</p>
          <p className="footer-credits">
            Crafted with <Heart size={13} fill="#ef4444" color="#ef4444" style={{ display: "inline", verticalAlign: "middle", margin: "0 2px" }} /> for hungry foodies.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
