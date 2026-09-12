import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/imageService.js";

function ProductCard({ product }) {
  const hasSale = product.salePrice && product.salePrice < product.price;

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const customerToken = localStorage.getItem("customerToken");

  useEffect(() => {
    const checkWishlist = async () => {
      if (!customerToken) return;

      try {
        const response = await fetch(
          "https://aura-fashion-store.onrender.com/api/wishlist",
          {
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();

        const exists = data.some(
          (item) => item.productId === product.id
        );

        setIsWishlisted(exists);
      } catch (error) {
        console.error("Wishlist check error:", error);
      }
    };

    checkWishlist();
  }, [product.id, customerToken]);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!customerToken) {
      alert("Please login to add products to your wishlist.");
      return;
    }

    try {
      setLoading(true);

      if (isWishlisted) {
        const response = await fetch(
          `https://aura-fashion-store.onrender.com/api/wishlist/${product.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to remove from wishlist");
        }

        setIsWishlisted(false);
      } else {
        const response = await fetch(
          `https://aura-fashion-store.onrender.com/api/wishlist/${product.id}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${customerToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to add to wishlist");
        }

        setIsWishlisted(true);
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      alert("Unable to update wishlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group block">
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

          <button
            type="button"
            onClick={handleWishlist}
            disabled={loading}
            aria-label={
              isWishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-sm transition hover:scale-105 disabled:opacity-60"
          >
            {isWishlisted ? "♥" : "♡"}
          </button>
        </div>

        <div className="pt-4">
          <p className="text-xs uppercase tracking-wider text-gray-500">
            {product.category}
          </p>

          <h3 className="mt-1 text-sm font-medium text-gray-900">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center gap-2">
            {hasSale ? (
              <>
                <span className="text-sm font-medium">
                  ₹{product.salePrice.toLocaleString("en-IN")}
                </span>

                <span className="text-sm text-gray-400 line-through">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;