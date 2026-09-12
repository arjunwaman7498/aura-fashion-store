import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getImageUrl } from "../services/imageService.js";

function Cart() {
    const navigate = useNavigate();
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Discover something beautiful from our collection.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-gray-900">
            Shopping Cart
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {cartItems.map((item) => {
              const price = item.salePrice ?? item.price;

              return (
                <div
                  key={`${item.id}-${item.selectedSize}`}
                  className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
                >
                <div className="h-64 w-full overflow-hidden rounded-xl bg-gray-50 sm:h-32 sm:w-28">
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="h-full w-full object-contain"
                 />
                </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-sm text-gray-500">
                        {item.category}
                      </p>

                      <h2 className="mt-1 text-lg font-semibold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        Size:{" "}
                        <span className="font-medium text-gray-800">
                          {item.selectedSize}
                        </span>
                      </p>

                      <p className="mt-1 font-medium">
                        ₹{price.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                      {/* Quantity */}
                      <div className="flex items-center rounded-lg border border-gray-300">
                        <button
                          onClick={() =>
                            decreaseQuantity(
                              item.id,
                              item.selectedSize
                            )
                          }
                          className="px-4 py-2 text-lg"
                        >
                          −
                        </button>

                        <span className="min-w-10 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(
                              item.id,
                              item.selectedSize
                            )
                          }
                          className="px-4 py-2 text-lg"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() =>
                          removeFromCart(
                            item.id,
                            item.selectedSize
                          )
                        }
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-left sm:text-right">
                    <p className="text-sm text-gray-500">
                      Item Total
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      ₹{(price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="mt-4 flex justify-between text-gray-600">
              <span>Shipping</span>

              <span>Free</span>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>

              <span>
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
                onClick={() => navigate("/checkout")}
                className="mt-6 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white hover:bg-gray-800"
            >
                Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm text-gray-500 hover:text-black"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Cart;