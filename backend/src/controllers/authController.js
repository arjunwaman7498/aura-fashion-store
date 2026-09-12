import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Register Customer
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      message: "Registration failed",
    });
  }
};

// Login 
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        message: "Email/username and password are required",
      });
    }

    // ==========================================
    // ADMIN LOGIN
    // ==========================================

    if (
      identifier === process.env.ADMIN_USERNAME &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        {
          role: "admin",
          username: identifier,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        }
      );

      return res.status(200).json({
        message: "Admin login successful",
        role: "admin",
        token,
      });
    }

    // ==========================================
    // CUSTOMER LOGIN
    // ==========================================

    const user = await prisma.user.findUnique({
      where: {
        email: identifier.toLowerCase(),
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email/username or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: "customer",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      role: "customer",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
    });
  }
};