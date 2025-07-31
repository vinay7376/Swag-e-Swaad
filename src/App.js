import React, { useEffect, useMemo, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ToastProvider } from "./components/Toast";
import "./App.css";

function RequireAuth({ user, children }) {
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("fz_theme");
    if (saved) return saved;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });
  useEffect(() => {
    localStorage.setItem("fz_theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("fz_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLogin = (u, { remember } = { remember: true }) => {
    setUser(u);
    if (remember) localStorage.setItem("fz_user", JSON.stringify(u));
  };
  const handleSignup = (u) => {
    setUser(u);
    localStorage.setItem("fz_user", JSON.stringify(u));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("fz_user");
  };

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("fz_cart");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("fz_cart", JSON.stringify(cart));
  }, [cart]);

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, x) => sum + x.qty, 0),
    [cart]
  );

  const buildKey = (id, size = "M", addons = []) => {
    const add = [...(addons || [])].sort().join(",");
    return `${id}|size=${size}|addons=${add}`;
  };

  const addToCart = (item) => {
    const key = buildKey(item.id, "M", []);
    setCart((prev) => {
      const current = prev[key]?.qty || 0;
      return {
        ...prev,
        [key]: {
          qty: current + 1,
          unitPrice: Math.round(item.price * 1.2),
          meta: { id: item.id, size: "M", addons: [] },
        },
      };
    });
  };

  const addConfiguredToCart = (item, { size, addons, unitPrice }) => {
    const key = buildKey(item.id, size, addons);
    setCart((prev) => {
      const current = prev[key]?.qty || 0;
      return {
        ...prev,
        [key]: {
          qty: current + 1,
          unitPrice,
          meta: { id: item.id, size, addons },
        },
      };
    });
  };

  const increaseQty = (key) => {
    setCart((prev) => {
      const current = prev[key]?.qty || 0;
      return { ...prev, [key]: { ...prev[key], qty: current + 1 } };
    });
  };

  const decreaseQty = (key) => {
    setCart((prev) => {
      const current = prev[key]?.qty || 0;
      if (current <= 1) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: { ...prev[key], qty: current - 1 } };
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const clearCart = () => setCart({});

  const getQtyForId = (id) =>
    Object.entries(cart).reduce((sum, [k, v]) => {
      const baseId = Number(k.split("|")[0]);
      return sum + (baseId === Number(id) ? v.qty : 0);
    }, 0);

  const [favs, setFavs] = useState(() => {
    try {
      const saved = localStorage.getItem("fz_favs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem("fz_favs", JSON.stringify(favs));
  }, [favs]);
  const toggleFav = (id) =>
    setFavs((prev) => {
      const copy = { ...prev };
      if (copy[id]) delete copy[id];
      else copy[id] = true;
      return copy;
    });
  const isFav = (id) => !!favs[id];

  return (
    <Router>
      <ToastProvider>
        <Navbar
          cartCount={cartCount}
          theme={theme}
          setTheme={setTheme}
          user={user}
          onLogout={handleLogout}
        />

        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/menu"
            element={
              <Menu
                cart={cart}
                getQtyForId={getQtyForId}
                addToCart={addToCart}
                addConfiguredToCart={addConfiguredToCart}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                isFav={isFav}
                toggleFav={toggleFav}
              />
            }
          />

          <Route
            path="/favorites"
            element={
              <RequireAuth user={user}>
                <Favorites
                  favIds={Object.keys(favs).map(Number)}
                  getQtyForId={getQtyForId}
                  addToCart={addToCart}
                  addConfiguredToCart={addConfiguredToCart}
                  increaseQty={increaseQty}
                  decreaseQty={decreaseQty}
                  isFav={isFav}
                  toggleFav={toggleFav}
                />
              </RequireAuth>
            }
          />

          <Route
            path="/cart"
            element={
              <Cart
                cart={cart}
                increaseQty={increaseQty}
                decreaseQty={decreaseQty}
                removeFromCart={removeFromCart}
                clearCart={clearCart}
              />
            }
          />

          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>

        <Footer />
      </ToastProvider>
    </Router>
  );
}
