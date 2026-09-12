import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getImageUrl } from "../services/imageService.js";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("customerToken");

  const fetchWishlist = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://192.168.1.14:5000/api/wishlist",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load wishlist");
      }

      setWishlist(data);
    } catch (error) {
      console.error(error);
      setError(error.message || "Unable to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    try {
      const response = await fetch(
        `http://192.168.1.14:5000/api/wishlist/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to remove product"
        );
      }

      setWishlist((current) =>
        current.filter((item) => item.productId !== productId)
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to remove product.");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-500">Loading wishlist...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
            My Wishlist
          </h1>

          <p className="mt-2 text-gray-500">
            Your saved fashion pieces
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm">
            <div className="text-5xl">♡</div>

            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="mt-2 text-gray-500">
              Save your favorite products and find them here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-sm text-gray-500">
              {wishlist.length}{" "}
              {wishlist.length === 1 ? "item" : "items"}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {wishlist.map((item) => {
                const product = item.product;

                const hasSale =
                  product.salePrice &&
                  product.salePrice < product.price;

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl bg-white shadow-sm"
                  >
                    <Link to={`/products/${product.id}`}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                        <img
                          src={getImageUrl(product.image)}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        {hasSale && (
                          <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-medium">
                            SALE
                          </span>
                        )}
                      </div>
                    </Link>

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        {product.category}
                      </p>

                      <Link to={`/products/${product.id}`}>
                        <h2 className="mt-1 text-sm font-medium text-gray-900 hover:underline">
                          {product.name}
                        </h2>
                      </Link>

                      <div className="mt-2 flex items-center gap-2">
                        {hasSale ? (
                          <>
                            <span className="text-sm font-medium">
                              ₹
                              {product.salePrice.toLocaleString(
                                "en-IN"
                              )}
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ₹
                              {product.price.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-medium">
                            ₹
                            {product.price.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(product.id)
                        }
                        className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-red-400 hover:text-red-600"
                      >
                        Remove from Wishlist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default Wishlist;