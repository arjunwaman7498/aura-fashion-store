import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        message: "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
        username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Admin login failed",
    });
  }
};

// Get all customer orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get all orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};


// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (Number.isNaN(orderId)) {
      return res.status(400).json({
        message: "Invalid order ID",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const existingOrder = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
    });

    if (!existingOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: true,
      },
    });

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    res.status(500).json({
      message: "Failed to update order status",
    });
  }
};

// Get admin dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await prisma.product.count();

    const totalOrders = await prisma.order.count();

    const totalCustomers = await prisma.user.count();

    const revenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        status: {
          not: "Cancelled",
        },
      },
    });

    const totalRevenue = revenueResult._sum.totalAmount || 0;

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
    });
  }
};