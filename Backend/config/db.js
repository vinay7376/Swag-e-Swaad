const mongoose = require("mongoose");

async function connectDB(uri) {
  if (!uri || typeof uri !== "string") {
    throw new Error("MONGODB_URI is missing. Create Backend/.env from Backend/.env.example and set a valid MongoDB connection string.");
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    const hint = /ECONNREFUSED|Server selection timed out/i.test(error.message)
      ? " Ensure MongoDB is running, or set MONGODB_URI to a reachable MongoDB Atlas URI."
      : "";
    throw new Error(`MongoDB connection failed: ${error.message}.${hint}`);
  }
}

module.exports = connectDB;
