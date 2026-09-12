import express from "express";

import {
  adminLogin,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from "../controllers/adminController.js";

import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin login
router.post("/login", adminLogin);

// Dashboard statistics
router.get("/stats", adminAuth, getDashboardStats);

// Get all customer orders
router.get("/orders", adminAuth, getAllOrders);

// Update order status
router.put(
  "/orders/:id/status",
  adminAuth,
  updateOrderStatus
);

export default router;