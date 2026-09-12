import express from "express";
import cors from "cors";
import "dotenv/config";

import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://192.168.1.14:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "AURA Fashion Store API is running",
  });
});

// Product API
app.use("/api/products", productRoutes);

// Admin API
app.use("/api/admin", adminRoutes);

// Customer Authentication API
app.use("/api/auth", authRoutes);

// Wishlist API
app.use("/api/wishlist", wishlistRoutes);

// Order API
app.use("/api/orders", orderRoutes);



// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Network: http://192.168.1.14:${PORT}`);
});