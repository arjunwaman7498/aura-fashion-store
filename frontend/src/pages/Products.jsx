import { useEffect, useMemo,useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

function Products() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const searchInputRef = useRef(null);

  const [searchParams] = useSearchParams();
  const categoryFromURL = searchParams.get("category") || "All";
  const [category, setCategory] = useState(categoryFromURL);

  useEffect(() => {
  if (searchParams.get("focus") === "search") { searchInputRef.current?.focus(); }
    }, [searchParams]);

  useEffect(() => {const categoryFromURL = searchParams.get("category") || "All";
    setCategory(categoryFromURL);}, [searchParams]);

  const [size, setSize] = useState("All");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [sort, setSort] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        // Keep compatibility with the existing ProductCard
        const formattedProducts = data.map((product) => ({
          ...product,
          size: product.sizes,
        }));

        setProducts(formattedProducts);
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesCategory =
        category === "All" || product.category === category;

      const matchesSize =
        size === "All" ||
        (Array.isArray(product.sizes) && product.sizes.includes(size));

      const currentPrice =
        product.salePrice !== null && product.salePrice !== undefined
          ? product.salePrice
          : product.price;

      const matchesPrice = currentPrice <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSize &&
        matchesPrice
      );
    });

    if (sort === "low-high") {
      result.sort(
        (a, b) =>
          (a.salePrice ?? a.price) - (b.salePrice ?? b.price)
      );
    }

    if (sort === "high-low") {
      result.sort(
        (a, b) =>
          (b.salePrice ?? b.price) - (a.salePrice ?? a.price)
      );
    }

    return result;
  }, [products, search, category, size, maxPrice, sort]);

  return (
    <div className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-semibold text-gray-900">
            Women&apos;s Fashion
          </h1>

          <p className="mt-2 text-gray-500">
            Discover elegant styles curated for every occasion.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 grid gap-4 rounded-2xl bg-white p-5 shadow-sm md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-gray-500"
          />

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-3 outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Sarees">Sarees</option>
            <option value="Kurtis">Kurtis</option>
            <option value="Dresses">Dresses</option>
            <option value="Lehengas">Lehengas</option>
          </select>

          {/* Size */}
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-3 outline-none"
          >
            <option value="All">All Sizes</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>

          {/* Price */}
          <div>
            <label className="mb-1 block text-sm text-gray-500">
              Max Price: ₹{maxPrice.toLocaleString("en-IN")}
            </label>

            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-gray-200 px-4 py-3 outline-none"
          >
            <option value="default">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-gray-500">
            Loading products...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        )}

        {/* No products */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No products found
            </h2>

            <p className="mt-2 text-gray-500">
              Try changing your search or filters.
            </p>
          </div>
        )}

        {/* Products */}
        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mb-5 text-sm text-gray-500">
              Showing {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Products;