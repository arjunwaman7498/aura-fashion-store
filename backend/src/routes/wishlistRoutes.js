import express from "express";

import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlistController.js";

import { protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get logged-in customer's wishlist
router.get("/", protectCustomer, getWishlist);

// Add product to wishlist
router.post("/:productId", protectCustomer, addToWishlist);

// Remove product from wishlist
router.delete("/:productId", protectCustomer, removeFromWishlist);

export default router;