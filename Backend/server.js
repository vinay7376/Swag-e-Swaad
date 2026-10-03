const path = require("path");
const dotenv = require("dotenv");

// Load the backend-local file explicitly, regardless of the shell working directory.
const envPath = path.resolve(__dirname, ".env");
const envResult = dotenv.config({ path: envPath, quiet: true });
if (envResult.error && envResult.error.code !== "ENOENT") {
  throw new Error(`Unable to read Backend/.env: ${envResult.error.message}`);
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const rawOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",").map((s) => s.trim()) : [];
const defaultOrigins = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "https://swag-e-swaad.vercel.app"];
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...rawOrigins]));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || /^https:\/\/.*swag-e-swaad.*\.vercel\.app$/.test(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "100kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => res.json({ success: true, message: "Swag-e-Swaad Backend is running" }));
app.use(notFound);
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB(process.env.MONGODB_URI);
    const port = Number(process.env.PORT) || 5000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  } catch (error) {
    console.error(`Startup failed: ${error.message}`);
    process.exitCode = 1;
  }
}

if (require.main === module) startServer();
module.exports = { app, startServer };
