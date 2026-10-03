# 🍽️ Swag-e-Swaad — Full-Stack Food Ordering Platform

[![React](https://img.shields.io/badge/Frontend-React%2019-blue?logo=react)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express%205-black?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Frontend%20Host-Vercel-black?logo=vercel)](https://swag-e-swaad.vercel.app)
[![Render](https://img.shields.io/badge/Backend%20Host-Render-blueviolet?logo=render)](https://swag-e-swaad.onrender.com)

**Swag-e-Swaad** is a modern full-stack MERN food delivery web application featuring dynamic dish customization, multi-factor cart calculations, coupon discount engines, Cash on Delivery (COD), Razorpay online payment integration with a development simulator, live order tracking, and a role-protected admin dashboard.

---

## 🌐 Live Deployments

- **Frontend (Vercel)**: [https://swag-e-swaad.vercel.app](https://swag-e-swaad.vercel.app)
- **Backend API (Render)**: [https://swag-e-swaad.onrender.com](https://swag-e-swaad.onrender.com)

---

## ✨ Features

- **🤖 AI-Powered Food Concierge & Recommendations**:
  - Global interactive AI assistant (powered by `/api/ai/chat` and `/api/ai/recommend`).
  - Natural language dish discovery based on mood (spicy, comfort, sweet, healthy, party).
  - Intelligent cart-based dish pairings with 1-click "Add to Cart" directly from the AI chat.
- **🔐 Authentication & Security**:
  - Secure JWT authentication with HTTP Bearer token headers.
  - Interactive password visibility toggles (`Eye` / `EyeOff`) across Login, Signup, and Reset Password forms.
  - Salted bcrypt password hashing (10/12 rounds).
  - User registration, login, profile updates, and in-app password changes.
  - End-to-end verified Forgot Password & Reset Password flows.
- **🍕 Menu & Catalog**:
  - Live dishes catalog with category filters, Veg/Non-Veg toggles, min ratings, and price range sliders.
  - Dish customization modal: Size selection (`S` 1.0x, `M` 1.2x, `L` 1.5x) and add-ons (`Extra Cheese`, `Extra Toppings`, `Extra Spicy`).
  - Favorites wishlist with user association.
- **🛒 Dynamic Cart & Checkout**:
  - Variant-aware multi-item cart storage with localStorage persistence.
  - Clean two-column food delivery checkout layout with item thumbnails, Veg/Non-Veg indicators, and quantity steppers.
  - Coupon discount engine:
    - `SAVE10`: 10% off subtotal
    - `FLAT50`: ₹50 flat discount
    - `FREESHIP`: Free delivery fee
  - Address validation (10–500 characters) and address prefill from user profile.
- **💳 Dual Payment System**:
  - **Cash on Delivery (COD)**: Instant order creation and confirmation.
  - **Online Payment**: Official Razorpay Checkout integration with server-side HMAC SHA-256 signature verification.
  - **Built-in Payment Simulator Mode**: Allows seamless online payment testing in local development without requiring an active Razorpay merchant account.
- **📦 Order Management & Live Tracking**:
  - Celebratory order confirmation banner upon placing orders.
  - Tamper-proof server-side order calculation and item pricing snapshots.
  - Real-time order progress timeline: `Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`.
  - Self-service order cancellation for pending/confirmed orders.
- **🛠️ Role-Protected Admin Dashboard**:
  - Operational metrics: Daily orders, total revenue, delivered/cancelled statistics.
  - Food catalog management: Add new dishes or delete items.
  - Order status workflow updater.
  - User management with order history counts.

---

## 🏛️ Architecture & Directory Structure

```
food-ordering/
├── Backend/
│   ├── config/          # Database connection (MongoDB Atlas / Local)
│   ├── controllers/     # Route logic (auth, food, order, admin)
│   ├── middleware/      # JWT protect, admin role check, error handlers
│   ├── models/          # Mongoose schemas (User, Food, Order)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Coupon rules and calculation helpers
│   ├── seedFoods.js     # Database seeder script
│   └── server.js        # Express server entry point with dynamic CORS
│
└── Frontend/
    ├── public/          # HTML index, manifests, and dish asset graphics
    └── src/
        ├── components/  # Navbar, Footer, FoodItem, CartItem, CustomizeModal, Toast
        ├── pages/       # Home, Menu, Cart, Orders, OrderDetails, Profile, Admin, Auth
        ├── services/    # Centralized api.js client with dynamic base URL
        └── App.css      # Custom modern responsive styling & design tokens
```

---

## 🚀 Local Quickstart Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/vinay7376/Swag-e-Swaad.git
cd Swag-e-Swaad
```

### 2. Configure Backend Environment
Create `Backend/.env` using `Backend/.env.example`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000,http://localhost:3001,https://swag-e-swaad.vercel.app
RAZORPAY_KEY_ID=rzp_test_ABC123456789
RAZORPAY_KEY_SECRET=XYZ987654321
```

### 3. Run Backend (Terminal 1)
```bash
cd Backend
npm install
npm run dev
```
API will listen on `http://localhost:5000`.

### 4. Run Frontend (Terminal 2)
```bash
cd Frontend
npm install
npm start
```
Frontend will automatically launch at `http://localhost:3000` (or `3001`).

---

## 📡 API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Create new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT |
| `POST` | `/api/auth/forgot-password`| Public | Verify user email for password reset |
| `POST` | `/api/auth/reset-password` | Public | Reset password with validation |
| `GET` | `/api/auth/profile` | Private | Fetch logged-in user details |
| `PATCH`| `/api/auth/profile` | Private | Update name, phone, or address |
| `PATCH`| `/api/auth/password`| Private | Change password for logged-in user |
| `GET` | `/api/foods` | Public | Search and filter dish catalog |
| `POST` | `/api/foods` | Admin | Create a new dish |
| `DELETE`| `/api/foods/:id` | Admin | Delete a dish |
| `POST` | `/api/orders` | Private | Create an order (COD or Online) |
| `POST` | `/api/orders/verify-payment`| Private | Verify Razorpay HMAC signature |
| `GET` | `/api/orders/my-orders` | Private | Retrieve user's order history |
| `GET` | `/api/orders/:id` | Private | View single order with status timeline |
| `PATCH`| `/api/orders/:id/cancel` | Private | Cancel pending/confirmed order |
| `POST` | `/api/ai/chat` | Public | AI Food Concierge recommendation chat |
| `POST` | `/api/ai/recommend` | Public | Contextual cart dish pairings |
| `GET` | `/api/admin/dashboard` | Admin | Aggregate sales & revenue dashboard |
| `GET` | `/api/orders/admin/all` | Admin | View all system orders |
| `PATCH`| `/api/orders/:id/status` | Admin | Advance order lifecycle status |

---

## 📜 License

This project is licensed under the ISC License.
