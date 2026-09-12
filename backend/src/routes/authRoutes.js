import express from "express";

import {
  register,
  login,
} from "../controllers/authController.js";

const router = express.Router();

// Customer registration
router.post("/register", register);

// Customer login
router.post("/login", login);

export default router;