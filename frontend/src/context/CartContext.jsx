import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("aura-cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("aura-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add product to cart
  const addToCart = (product, size, quantity = 1) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) =>
          item.id === product.id && item.selectedSize === size
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id &&
          item.selectedSize === size
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.stock
                ),
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          selectedSize: size,
          quantity,
        },
      ];
    });
  };

  // Increase quantity
  const increaseQuantity = (id, size) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.selectedSize === size
          ? {
              ...item,
              quantity: Math.min(
                item.quantity + 1,
                item.stock
              ),
            }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id, size) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === id && item.selectedSize === size
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeFromCart = (id, size) => {
    setCartItems((currentItems) =>
      currentItems.filter(
        (item) =>
          !(item.id === id && item.selectedSize === size)
      )
    );
  };

  // Clear cart
const clearCart = () => {
  setCartItems([]);
};

  // Total number of products
  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Cart total
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.salePrice ?? item.price;

    return total + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}