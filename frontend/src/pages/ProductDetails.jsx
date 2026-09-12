import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { getImageUrl } from "../services/imageService.js";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();

        setProduct(data);

        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-semibold">
          Product not found
        </h2>

        <Link
          to="/products"
          className="rounded-lg bg-black px-6 py-3 text-white"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const currentPrice = product.salePrice ?? product.price;

  return (
    <main className="min-h-screen bg-[#faf9f7]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-2">

          {/* Product Image */}
          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Information */}
          <div>
            <Link
              to="/products"
              className="text-sm text-gray-500 hover:text-black"
            >
              ← Back to Shop
            </Link>

            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-500">
              {product.category}
            </p>

            <h1 className="mt-2 text-4xl font-semibold text-gray-900">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-center gap-3">
              <span className="text-2xl font-semibold">
                ₹{currentPrice.toLocaleString("en-IN")}
              </span>

              {product.salePrice && (
                <span className="text-lg text-gray-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-6 leading-7 text-gray-600">
              {product.description}
            </p>

            {/* Stock */}
            <div className="mt-5">
              <span className="text-sm font-medium">
                Stock:
              </span>

              <span className="ml-2 text-sm text-green-600">
                {product.stock} available
              </span>
            </div>

            {/* Sizes */}
            <div className="mt-8">
              <h3 className="mb-3 font-medium">
                Select Size
              </h3>

              <div className="flex gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 w-12 rounded-lg border text-sm font-medium transition ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white hover:border-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-8">
              <h3 className="mb-3 font-medium">
                Quantity
              </h3>

              <div className="flex w-fit items-center rounded-lg border border-gray-300 bg-white">
                <button
                  onClick={() =>
                    setQuantity((q) => Math.max(1, q - 1))
                  }
                  className="px-4 py-2 text-xl"
                >
                  −
                </button>

                <span className="min-w-12 text-center font-medium">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(product.stock, q + 1)
                    )
                  }
                  className="px-4 py-2 text-xl"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add To Cart */}
            <button
  className="mt-10 w-full rounded-xl bg-black py-4 text-sm font-semibold text-white transition hover:bg-gray-800"
  onClick={() => {
    addToCart(product, selectedSize, quantity);
    alert("Product added to cart!");
  }}
>
  Add to Cart
</button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;