import prisma from "../lib/prisma.js";

// Add product to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    // Check product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Check if already in wishlist
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({
        message: "Product is already in your wishlist",
      });
    }

    const wishlist = await prisma.wishlist.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Add wishlist error:", error);

    res.status(500).json({
      message: "Failed to add product to wishlist",
    });
  }
};

// Get logged-in user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("Get wishlist error:", error);

    res.status(500).json({
      message: "Failed to fetch wishlist",
    });
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const wishlist = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlist) {
      return res.status(404).json({
        message: "Product is not in your wishlist",
      });
    }

    await prisma.wishlist.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    res.status(200).json({
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);

    res.status(500).json({
      message: "Failed to remove product from wishlist",
    });
  }
};