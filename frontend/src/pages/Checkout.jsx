import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const customerToken = localStorage.getItem("customerToken");

  const customer = JSON.parse(
    localStorage.getItem("customer") || "null"
  );

  const [formData, setFormData] = useState({
    customerName: customer?.name || "",
    email: customer?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerToken) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setLoading(true);

    try {
      // Convert existing cart structure
      // selectedSize -> size for backend
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        size: item.selectedSize,
      }));

      const response = await fetch(
        "https://aura-fashion-store.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customerToken}`,
          },
          body: JSON.stringify({
            ...formData,
            items,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to place order"
        );
      }

      // Clear cart after successful order
      clearCart();

      // Go to My Orders
      navigate("/orders", {
      state: {
        orderPlaced: true,
      },
    });
    
    } catch (err) {
      console.error("Checkout error:", err);

      setError(
        err.message || "Something went wrong while placing your order."
      );
    } finally {
      setLoading(false);
    }
  };

  // Login required
  if (!customerToken) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please login to continue with checkout.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="mt-6 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </main>
    );
  }

  // Empty cart
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Cart is Empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add products before proceeding to checkout.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-gray-900">
            Checkout
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your details to place your order.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Delivery Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a valid 10-digit phone number"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="10-digit mobile number"
                  />
                </div>

                {/* Pincode */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Pincode
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{6}"
                    title="Please enter a valid 6-digit pincode"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="6-digit pincode"
                  />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-gray-700">
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="House/flat number, street, area"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="City"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                    placeholder="State"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Place Order */}
              <button
                type="submit"
                disabled={loading}
                className="mt-8 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4">
              {cartItems.map((item) => {
                const price =
                  item.salePrice ?? item.price;

                return (
                  <div
                    key={`${item.id}-${item.selectedSize}`}
                    className="flex gap-4 border-b border-gray-100 pb-4"
                  >
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        Size: {item.selectedSize}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>

                      <p className="mt-2 text-sm font-medium text-gray-900">
                        ₹
                        {(
                          price * item.quantity
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>

                <span>Free</span>
              </div>

              <div className="flex justify-between border-t border-gray-100 pt-4 text-lg font-semibold text-gray-900">
                <span>Total</span>

                <span>
                  ₹{cartTotal.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Checkout;