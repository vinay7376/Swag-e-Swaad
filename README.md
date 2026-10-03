# 🍽️ Swag-e-Swaad — Modern Full-Stack Food Ordering Platform

[![React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Express](https://img.shields.io/badge/Backend-Express%205-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Node.js](https://img.shields.io/badge/Runtime-Node.js%20v20-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Frontend%20Host-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://swag-e-swaad.vercel.app)
[![Render](https://img.shields.io/badge/Backend%20Host-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://swag-e-swaad.onrender.com)

**Swag-e-Swaad** is a production-grade full-stack food delivery web application built with the MERN stack. It offers dynamic dish customizations, coupon discount engines, Cash on Delivery (COD), Razorpay online payment integration with a development payment simulator, real-time order lifecycle tracking, an AI-powered food concierge, and a role-protected administrative analytics dashboard.

---

## 🌐 Live Deployments

- 🚀 **Live Frontend (Vercel)**: [https://swag-e-swaad.vercel.app](https://swag-e-swaad.vercel.app)
- ⚙️ **Live Backend API (Render)**: [https://swag-e-swaad.onrender.com](https://swag-e-swaad.onrender.com)
- 📂 **GitHub Repository**: [https://github.com/vinay7376/Swag-e-Swaad](https://github.com/vinay7376/Swag-e-Swaad)

---

## ⚡ Instant Recruiter / Evaluator Demo Access

To make testing seamless for recruiters, interviewers, and evaluators, **1-Click Demo Login** buttons are embedded directly on the [Login Page](https://swag-e-swaad.vercel.app/login). You can log in instantly without filling in forms or creating new accounts:

| Role | Quick Button on `/login` | Email | Password | Permissions & Capabilities |
|---|---|---|---|---|
| **👤 Customer Demo** | `👤 Customer Demo` | `demo@swageswaad.com` | `demo@123` | Browse catalog, dish customizations, cart, coupons, COD/Online checkout, order tracking, wishlist |
| **🛡️ Admin Demo** | `🛡️ Admin Demo` | `admin@swageswaad.com` | `admin@123` | Full Admin Dashboard, real-time revenue analytics, order status dispatch updater, menu item manager |

> **Tip:** You can also register your own personal account anytime at `/signup`.

---

## ✨ Key Features

### 🤖 1. AI-Powered Food Concierge & Pairings
- **Global AI Food Chat**: Integrated AI assistant capable of recommending dishes based on mood (spicy, comfort, sweet, healthy, party).
- **Contextual Cart Pairings**: Real-time side dish, beverage, and dessert suggestions based on items currently in your cart.
- **1-Click Cart Addition**: Add AI-recommended dishes directly into your order with a single click inside the chat drawer.

### 🔐 2. Authentication, Profile & Security
- **JWT Authentication**: Secure token-based session management with HTTP Bearer authorization headers.
- **Password Visibility Toggles**: Interactive `Eye` / `EyeOff` controls across Login, Signup, and Reset Password pages.
- **Salted Bcrypt Security**: Multi-round password hashing on database writes.
- **Self-Service Password Recovery**: End-to-end verified Forgot Password and Reset Password workflows.
- **Profile Management**: Update delivery address, contact details, and change account passwords in-app.

### 🍕 3. Dynamic Menu & Dish Customization
- **Multi-Filter Catalog**: Live search, category pills, Veg/Non-Veg filter toggles, price range sliders, and minimum rating filters.
- **Item Customization Modal**:
  - Size variants: Small (`1.0x`), Medium (`1.2x`), Large (`1.5x`).
  - Add-ons: Extra Cheese (`+₹30`), Extra Toppings (`+₹25`), Extra Spicy (`+₹15`).
- **Wishlist / Favorites**: Save favorite dishes linked to your user account.

### 🛒 4. Smart Cart & Promotional Discounts
- **Variant-Aware Cart**: Separate line items for unique size and add-on combinations with `localStorage` persistence.
- **Coupon Discount Engine**:
  - `SAVE10`: 10% discount on cart subtotal.
  - `FLAT50`: ₹50 flat instant discount.
  - `FREESHIP`: 100% discount on delivery fees.
- **Address Validation**: 10–500 character validation with prefill from user profile.

### 💳 5. Dual Payment System
- **Cash on Delivery (COD)**: Instant order creation with zero transaction friction.
- **Razorpay Online Checkout**: Official Razorpay integration with backend HMAC SHA-256 signature verification.
- **Built-in Payment Simulator Mode**: In local or sandbox environments without live Razorpay credentials, users can test complete online checkout flows smoothly.

### 📦 6. Order Tracking & Lifecycle Management
- **Visual Progress Tracker**: Live progress timeline: `Pending` ➔ `Confirmed` ➔ `Preparing` ➔ `Out for Delivery` ➔ `Delivered`.
- **Order History**: Detailed view of past orders, item snapshots, delivery addresses, and payment statuses.
- **Self-Service Order Cancellation**: Cancel orders anytime while in `Pending` or `Confirmed` status.

### 🛡️ 7. Role-Protected Admin Dashboard
- **Operational Metrics**: Total revenue, total orders count, completed deliveries, and cancelled statistics.
- **Status Workflow Manager**: Seamlessly advance customer order status with real-time UI synchronization.
- **Menu Management**: Add brand new dishes with images, categories, and prices, or remove discontinued items.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Hooks, Context API, React Router v7)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Keyframe Animations
- **Styling**: Modern Vanilla CSS Design System with responsive grid layouts and CSS variables

### Backend
- **Runtime**: Node.js v20+
- **Framework**: Express 5
- **Database**: MongoDB Atlas with Mongoose ODM
- **Security**: JSON Web Tokens (jsonwebtoken), Bcrypt.js, CORS
- **Payments**: Razorpay SDK + Crypto HMAC-SHA256 signature verification

### Cloud & DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Database Hosting**: MongoDB Atlas

---

## 📁 Project Directory Structure

```
food-ordering/
├── Backend/
│   ├── config/              # MongoDB connection configuration
│   │   └── db.js
│   ├── controllers/         # Core API logic controllers
│   │   ├── authController.js
│   │   ├── foodController.js
│   │   ├── orderController.js
│   │   ├── aiController.js
│   │   └── adminController.js
│   ├── middleware/          # Security & authorization middleware
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Food.js
│   │   └── Order.js
│   ├── routes/              # Express API route modules
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── aiRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/               # Coupon calculation and helper utilities
│   ├── seedFoods.js         # Initial database seeder script
│   └── server.js            # Express server entry point with dynamic CORS
│
└── Frontend/
    ├── public/              # Static assets, favicon, manifests
    └── src/
        ├── components/      # Reusable UI components
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── FoodItem.jsx
        │   ├── CartItem.jsx
        │   ├── CustomizeModal.jsx
        │   ├── AIChatDrawer.jsx
        │   └── Toast.jsx
        ├── context/         # React Context providers (Auth, Cart)
        ├── pages/           # Application views
        │   ├── Home.jsx
        │   ├── Menu.jsx
        │   ├── Cart.jsx
        │   ├── Orders.jsx
        │   ├── OrderDetails.jsx
        │   ├── Profile.jsx
        │   ├── Admin.jsx
        │   ├── Login.jsx
        │   ├── Signup.jsx
        │   ├── ForgotPassword.jsx
        │   └── ResetPassword.jsx
        ├── services/        # Centralized Axios/fetch API client
        │   └── api.js
        ├── App.jsx          # Application routing and root state
        └── App.css          # Design system, responsive layout tokens
```

---

## 🚀 Local Quickstart Guide

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas cluster URI (or local MongoDB running on `localhost:27017`)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/vinay7376/Swag-e-Swaad.git
cd Swag-e-Swaad
```

---

### Step 2: Configure Environment Variables

#### Backend Configuration
Create a `.env` file in the `Backend/` folder:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000,http://localhost:3001,https://swag-e-swaad.vercel.app
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=placeholder_secret
```

#### Frontend Configuration (Optional)
If running Frontend against a custom API URL, create `.env` in `Frontend/`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 3: Install Dependencies & Run

#### Terminal 1 — Start Backend Server
```bash
cd Backend
npm install
npm run dev
```
Backend will start on `http://localhost:5000`.

#### Terminal 2 — Start Frontend Application
```bash
cd Frontend
npm install
npm start
```
Frontend will automatically open at `http://localhost:3000`.

---

## 📡 API Reference Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new customer account |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `POST` | `/api/auth/forgot-password` | Public | Request email password reset code/link |
| `POST` | `/api/auth/reset-password` | Public | Reset password with token/validation |
| `GET` | `/api/auth/profile` | Private | Fetch authenticated user profile |
| `PATCH`| `/api/auth/profile` | Private | Update user name, phone, or address |
| `PATCH`| `/api/auth/password`| Private | Update account password |

### 🍔 Menu & Food Catalog (`/api/foods`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/foods` | Public | Get list of food items with search & filters |
| `GET` | `/api/foods/:id` | Public | Get specific dish details |
| `POST` | `/api/foods` | Admin | Create a new food catalog item |
| `DELETE`| `/api/foods/:id` | Admin | Delete a food item |

### 📦 Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Private | Create order (Cash on Delivery or Razorpay) |
| `POST` | `/api/orders/verify-payment`| Private | Verify Razorpay HMAC signature |
| `GET` | `/api/orders/my-orders` | Private | Get authenticated user's order history |
| `GET` | `/api/orders/:id` | Private | Get single order details with status timeline |
| `PATCH`| `/api/orders/:id/cancel` | Private | Cancel pending/confirmed order |

### 🤖 AI Concierge (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/chat` | Public | AI Food Concierge recommendation chat |
| `POST` | `/api/ai/recommend` | Public | Cart-aware dish pairing recommendations |

### 🛡️ Admin Dashboard (`/api/admin` & `/api/orders/admin`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | Admin | Aggregate sales revenue, order counts & stats |
| `GET` | `/api/orders/admin/all` | Admin | View all system customer orders |
| `PATCH`| `/api/orders/:id/status` | Admin | Update order status (`Confirmed` ➔ `Delivered`) |

---

## 👨‍💻 Author & Contact

**Vinay**  
- 📧 **Email**: [vphandia7376@gmail.com](mailto:vphandia7376@gmail.com)  
- 🐙 **GitHub**: [@vinay7376](https://github.com/vinay7376)  
- 🌐 **Project URL**: [https://swag-e-swaad.vercel.app](https://swag-e-swaad.vercel.app)  

---

## 📜 License

This project is licensed under the [ISC License](LICENSE).
