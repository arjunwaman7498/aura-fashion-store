import prisma from "../lib/prisma.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      customerName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      items,
    } = req.body;

    // Validate customer details
    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "All customer details are required",
      });
    }

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty",
      });
    }

    // Fetch products from database
    const productIds = items.map((item) => Number(item.productId));

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        message: "One or more products are no longer available",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    // Validate every cart item
    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);
      const size = item.size;

      const product = products.find(
        (p) => p.id === productId
      );

      if (!product) {
        return res.status(404).json({
          message: `Product not found`,
        });
      }

      if (!quantity || quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${product.name}`,
        });
      }

      if (!size) {
        return res.status(400).json({
          message: `Please select a size for ${product.name}`,
        });
      }

      // Check whether selected size exists
      if (!product.sizes.includes(size)) {
        return res.status(400).json({
          message: `Selected size is not available for ${product.name}`,
        });
      }

      // Check stock
      if (product.stock < quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available stock: ${product.stock}`,
        });
      }

      // Use sale price when available
      const finalPrice = product.salePrice ?? product.price;

      const itemTotal = finalPrice * quantity;

      totalAmount += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        price: finalPrice,
        quantity,
        size,
      });
    }

    // Create order and reduce stock in one transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          customerName: customerName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),

          items: {
            create: orderItems,
          },
        },
        include: {
          items: true,
        },
      });

      // Reduce product stock
      for (const item of orderItems) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: "Failed to place order",
    });
  }
};


// Get logged-in customer's orders
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        userId,
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};