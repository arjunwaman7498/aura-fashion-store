import prisma from "../lib/prisma.js";

// GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);

    res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      salePrice,
      sizes,
      stock,
    } = req.body;

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      !sizes ||
      stock === undefined ||
      !image
    ) {
      return res.status(400).json({
        message: "All required fields and an image must be provided",
      });
    }

    let parsedSizes = sizes;

    if (typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {
        parsedSizes = sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean);
      }
    }

    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      return res.status(400).json({
        message: "At least one size is required",
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        price: Number(price),
        salePrice:
          salePrice === undefined ||
          salePrice === null ||
          salePrice === ""
            ? null
            : Number(salePrice),
        sizes: parsedSizes,
        stock: Number(stock),
        image,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    const {
      name,
      description,
      category,
      price,
      salePrice,
      sizes,
      stock,
    } = req.body;

    let parsedSizes = sizes;

    if (typeof sizes === "string") {
      try {
        parsedSizes = JSON.parse(sizes);
      } catch {
        parsedSizes = sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean);
      }
    }

    const image = req.file
      ? `/uploads/${req.file.filename}`
      : undefined;

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && {
          price: Number(price),
        }),
        ...(salePrice !== undefined && {
          salePrice:
            salePrice === null || salePrice === ""
              ? null
              : Number(salePrice),
        }),
        ...(parsedSizes !== undefined && {
          sizes: parsedSizes,
        }),
        ...(stock !== undefined && {
          stock: Number(stock),
        }),
        ...(image !== undefined && {
          image,
        }),
      },
    });

    res.status(200).json(product);
  } catch (error) {
    console.error("Update product error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        message: "Invalid product ID",
      });
    }

    await prisma.product.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};