import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-zinc-950 text-white px-6 py-10 font-inter w-full border-t border-zinc-800">
      <div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center text-center gap-6">
        {/* Brand and Tagline */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🍽️ <span className="text-white">Swag-e-Swaad</span>
          </h2>
          <p className="text-sm text-zinc-400">Delicious food, delivered fast.</p>
        </div>

        {/* Social Icons */}
        <div className="flex gap-5">
          <a href="#" className="hover:text-blue-500"><FaFacebook size={20} /></a>
          <a href="#" className="hover:text-pink-500"><FaInstagram size={20} /></a>
          <a href="#" className="hover:text-sky-400"><FaTwitter size={20} /></a>
          <a href="#" className="hover:text-red-500"><FaYoutube size={20} /></a>
        </div>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-400">
          <a href="/Menu" className="hover:text-white">Menu</a>
          <a href="/Favorites" className="hover:text-white">Favorites</a>
          <a href="/Cart" className="hover:text-white">Cart</a>
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Contact</a>
          <a href="#" className="hover:text-white">FAQ</a>
        </div>

        {/* Copyright */}
        <div className="pt-6 text-xs text-zinc-500 border-t border-zinc-800 w-full text-center">
          <p className="pt-4">© {new Date().getFullYear()} FoodieZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
