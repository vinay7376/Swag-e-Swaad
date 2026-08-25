# Swag-e-Swaad

Swag-e-Swaad is a full-stack food ordering platform for browsing a live menu, configuring dishes, placing cash-on-delivery or Razorpay test payments, and managing orders. It includes a role-protected admin dashboard for operational management.

## Features

- JWT authentication, secure password hashing, profile updates, and password changes
- Menu search/filtering, favourites, persistent variant-aware cart, coupons, and availability checks
- Backend-calculated order pricing: subtotal, discount, delivery, tax, and immutable item snapshots
- COD and Razorpay test-mode checkout with server-side signature verification
- Order history, details, cancellation, and status timeline data
- Admin dashboard, order workflow, food APIs, and user list
- Responsive React UI with theme, loading, empty, and error states

## Stack and architecture

React (Create React App) talks to an Express REST API. Express uses MongoDB/Mongoose for users, foods, and orders. JWT authenticates users; role middleware protects admin endpoints. Razorpay credentials are only used by the backend.

```
Frontend/src/       React pages, components, and API client
Backend/models/     User, Food, and immutable Order snapshots
Backend/controllers REST application logic
Backend/middleware  authentication, authorization, and error handling
Backend/utils/      coupons and shared backend rules
```

## Setup

1. Install MongoDB locally or create an Atlas database.
2. Copy `Backend/.env.example` to `Backend/.env` and set `MONGODB_URI` and a long random `JWT_SECRET`.
3. For online payments, add Razorpay **test** keys to the same file.

Run the API:

```bash
cd Backend
npm install
npm run dev
```

Run the client in another terminal:

```bash
cd Frontend
npm install
npm start
```

The API runs at `http://localhost:5000`; the client runs at `http://localhost:3000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random JWT signing secret |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `CLIENT_URL` | Allowed client origin |
| `RAZORPAY_KEY_ID` | Razorpay test public key |
| `RAZORPAY_KEY_SECRET` | Razorpay test secret; backend only |

Never commit `.env` files or real credentials.

## API overview

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/PATCH /api/auth/profile`, `PATCH /api/auth/password`
- `GET /api/foods`; admin `POST/PUT/DELETE /api/foods/:id`
- `POST /api/orders`, `GET /api/orders/my-orders`, `GET /api/orders/:id`, `PATCH /api/orders/:id/cancel`
- `POST /api/orders/verify-payment`, `PATCH /api/orders/:id/payment-failed`
- Admin: `GET /api/admin/dashboard`, `GET /api/admin/users`, `GET /api/orders/admin/all`, `PATCH /api/orders/:id/status`

## Lifecycle and payment flow

Orders progress from `pending` → `confirmed` → `preparing` → `out_for_delivery` → `delivered`, with logical cancellation safeguards. COD begins as payment `pending`. Online orders are created server-side, paid through Razorpay Checkout, and marked `paid` only after HMAC signature verification on the server.

## Security and testing

Passwords are bcrypt-hashed, user order lookups are owner-scoped, and admin routes require `role: admin`. Food prices and coupon totals sent by browsers are ignored. Build the frontend with `npm run build`; validate the backend with `node --check server.js`. For end-to-end testing, provide a reachable MongoDB and Razorpay test credentials, register a user, promote an account to `admin` directly in the development database, and exercise the protected routes.

## Deployment and future work

Deploy the API with environment variables and a managed MongoDB database; point `REACT_APP_API_URL` at its HTTPS URL for a production client build. Useful next steps are image upload storage, email receipts, Razorpay webhooks/refunds, pagination, automated API tests, and an admin food-editing form.

## Screenshots

Add current desktop and mobile screenshots here after running the app locally.
