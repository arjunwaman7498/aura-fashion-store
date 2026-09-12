import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Orders() {
  const location = useLocation();
  const orderPlaced = location.state?.orderPlaced;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const customerToken = localStorage.getItem("customerToken");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!customerToken) {
        setError("Please login to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://aura-fashion-store.onrender.com/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders"
          );
        }

        setOrders(data);
      } catch (err) {
        console.error("Orders error:", err);
        setError(
          err.message || "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [customerToken]);

  if (!customerToken) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">
            Login Required
          </h1>

          <p className="mt-3 text-gray-500">
            Please login to view your orders.
          </p>

          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-gray-500">
            Loading your orders...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-red-500">{error}</p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-gray-900">
            No Orders Yet
          </h1>

          <p className="mt-3 text-gray-500">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-block rounded-xl bg-black px-7 py-3 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="mx-auto max-w-6xl">

        {orderPlaced && (
  <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4">
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
        ✓
      </div>

      <div>
        <p className="font-semibold text-green-800">
          Order placed successfully!
        </p>

        <p className="mt-1 text-sm text-green-700">
          Thank you for shopping with AURA. Your order has been confirmed.
        </p>
      </div>
    </div>
  </div>
)}

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-gray-900">
            My Orders
          </h1>

          <p className="mt-2 text-gray-500">
            View your recent orders and order details.
          </p>
        </div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow-sm sm:p-8"
            >
              {/* Order Header */}
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID
                  </p>

                  <h2 className="mt-1 text-lg font-semibold text-gray-900">
                    #{order.id}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700">
                    {order.status}
                  </span>

                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="mt-6 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 pb-4"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.productName}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size} · Qty: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium text-gray-900">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery Address */}
              <div className="mt-6 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-900">
                  Delivery Address
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {order.customerName}
                  <br />
                  {order.address}
                  <br />
                  {order.city}, {order.state} -{" "}
                  {order.pincode}
                  <br />
                  Phone: {order.phone}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            to="/products"
            className="inline-block rounded-xl border border-gray-300 bg-white px-7 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Orders;