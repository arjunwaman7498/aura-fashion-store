import express from "express";

import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import { adminAuth } from "../middleware/adminAuth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected Admin routes
router.post("/", adminAuth, upload.single("image"), createProduct);
router.put("/:id", adminAuth, upload.single("image"), updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

export default router;