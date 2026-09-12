import express from "express";

import {
  createOrder,
  getMyOrders,
} from "../controllers/orderController.js";

import { protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Place a new order
router.post("/", protectCustomer, createOrder);

// Get logged-in customer's orders
router.get("/my", protectCustomer, getMyOrders);

export default router;