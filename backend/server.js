const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn(
    "Warning: JWT_SECRET is not set. Using fallback secret. This is insecure for production.",
  );
}

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/shopnova";

if (!process.env.MONGO_URI) {
  console.warn(
    "Warning: MONGO_URI is not set. Using default local MongoDB URI. \n" +
      "If you do not have MongoDB running locally, set MONGO_URI in a .env file to a valid connection string.",
  );
}

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("ShopNova API is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
