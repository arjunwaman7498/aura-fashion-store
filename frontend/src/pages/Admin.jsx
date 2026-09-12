import { useEffect, useState } from "react";
import { getImageUrl } from "../services/imageService.js";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const initialForm = {
  name: "",
  description: "",
  category: "Sarees",
  price: "",
  salePrice: "",
  sizes: [],
  stock: "",
  image: "",
};

function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    });

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState("");


  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const sizeOptions = ["XS", "S", "M", "L", "XL"];

  // =========================
  // Fetch Products
  // =========================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
// Fetch Orders
// =========================
const fetchOrders = async () => {
  try {
    setOrdersLoading(true);
    setOrdersError("");

    const response = await fetch(
      "https://aura-fashion-store.onrender.com/api/admin/orders",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
    console.error(err);
    setOrdersError(
      err.message || "Unable to load orders."
    );
  } finally {
    setOrdersLoading(false);
  }
};


// =========================
// Fetch Dashboard Statistics
// =========================
const fetchStats = async () => {
  try {
    setStatsLoading(true);
    setStatsError("");

    const response = await fetch(
      "https://aura-fashion-store.onrender.com/api/admin/stats",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to fetch dashboard statistics"
      );
    }

    setStats(data);
  } catch (err) {
    console.error(err);

    setStatsError(
      err.message || "Unable to load dashboard statistics."
    );
  } finally {
    setStatsLoading(false);
  }
};

useEffect(() => {
  fetchOrders();
  fetchStats();
}, []);

// =========================
// Update Order Status
// =========================
const handleOrderStatusChange = async (orderId, status) => {
  try {
    setUpdatingOrderId(orderId);
    setOrdersError("");

    const response = await fetch(
      `https://aura-fashion-store.onrender.com/api/admin/orders/${orderId}/status`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({
          status,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update order status"
      );
    }

    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
            }
          : order
      )
    );
  } catch (err) {
    console.error(err);
    setOrdersError(
      err.message || "Failed to update order status."
    );
  } finally {
    setUpdatingOrderId(null);
  }
};


  // =========================
  // Handle Inputs
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // =========================
  // Handle Sizes
  // =========================
  const handleSizeChange = (size) => {
    setForm((current) => ({
      ...current,
      sizes: current.sizes.includes(size)
        ? current.sizes.filter((item) => item !== size)
        : [...current.sizes, size],
    }));
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setImageFile(null);
    setError("");
    setSuccess("");
  };

  // =========================
// Add / Update Product
// =========================
const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");
  setSuccess("");

  if (
    !form.name.trim() ||
    !form.description.trim() ||
    !form.category ||
    !form.price ||
    form.stock === ""
  ) {
    setError("Please fill in all required fields.");
    return;
  }

  if (!editingId && !imageFile) {
    setError("Please select a product image.");
    return;
  }

  if (form.sizes.length === 0) {
    setError("Please select at least one size.");
    return;
  }

  if (Number(form.price) < 0 || Number(form.stock) < 0) {
    setError("Price and stock cannot be negative.");
    return;
  }

  if (
    form.salePrice !== "" &&
    Number(form.salePrice) < 0
  ) {
    setError("Sale price cannot be negative.");
    return;
  }

  if (
    form.salePrice !== "" &&
    Number(form.salePrice) > Number(form.price)
  ) {
    setError(
      "Sale price cannot be higher than the regular price."
    );
    return;
  }

  try {
    setSaving(true);

    const isEditing = editingId !== null;

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("price", Number(form.price));

    formData.append(
      "salePrice",
      form.salePrice === ""
        ? ""
        : Number(form.salePrice)
    );

    formData.append(
      "sizes",
      JSON.stringify(form.sizes)
    );

    formData.append("stock", Number(form.stock));

    // Add image only when a new image is selected
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch(
      isEditing ? `${API_URL}/${editingId}` : API_URL,
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem(
            "adminToken"
          )}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to ${
            isEditing ? "update" : "create"
          } product`
      );
    }

    const message = isEditing
      ? "Product updated successfully."
      : "Product added successfully.";

    setForm(initialForm);
    setImageFile(null);
    setEditingId(null);
    setSuccess(message);

    await fetchProducts();
  } catch (err) {
    console.error(err);

    setError(
      err.message ||
        `Failed to ${
          editingId ? "update" : "add"
        } product.`
    );
  } finally {
    setSaving(false);
  }
};

  // =========================
  // Start Editing
  // =========================
  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      salePrice: product.salePrice ?? "",
      sizes: product.sizes,
      stock: product.stock,
      image: product.image,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Delete Product
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`, 
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setSuccess("Product deleted successfully.");

      if (editingId === id) {
        resetForm();
      }

      await fetchProducts();
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Failed to delete product."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#faf9f7] px-6 py-10">
      <div className="mx-auto max-w-7xl">

 {/* =========================
     HEADER
    ========================= */ }

<div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
  <div>
    <p className="text-sm tracking-[0.3em] text-gray-500">
      AURA ADMIN
    </p>

    <h1 className="mt-2 text-3xl font-semibold text-gray-900 sm:text-4xl">
      Product Management
    </h1>

    <p className="mt-2 text-gray-500">
      Add and manage products in your fashion store.
    </p>
    </div>
    </div>

{/* =========================
    DASHBOARD STATISTICS
    ========================= */}
<section className="mb-8">
  {statsError && (
    <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
      {statsError}
    </div>
  )}

  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

    {/* Products */}
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Total Products
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {statsLoading ? "—" : stats.totalProducts}
      </p>
    </div>

    {/* Orders */}
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Total Orders
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {statsLoading ? "—" : stats.totalOrders}
      </p>
    </div>

    {/* Customers */}
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Total Customers
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-900">
        {statsLoading ? "—" : stats.totalCustomers}
      </p>
    </div>

    {/* Revenue */}
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">
        Total Revenue
      </p>

      <p className="mt-2 text-3xl font-semibold text-gray-900">
        ₹
        {statsLoading
          ? "—"
          : stats.totalRevenue.toLocaleString("en-IN")}
      </p>
    </div>

  </div>
</section>

{/* =========================
     PRODUCT FORM
    ========================= */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-semibold text-gray-900">
              {editingId !== null
                ? "Edit Product"
                : "Add New Product"}
            </h2>

            {editingId !== null && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-500 hover:text-black"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            {/* Product Name */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Product Name *
              </label>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Floral Anarkali Kurti"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none"
              >
                <option value="Sarees">Sarees</option>
                <option value="Kurtis">Kurtis</option>
                <option value="Dresses">Dresses</option>
                <option value="Lehengas">Lehengas</option>
              </select>
            </div>

            {/* Regular Price */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Regular Price *
              </label>

              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min="0"
                placeholder="4999"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Sale Price */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Sale Price
              </label>

              <input
                type="number"
                name="salePrice"
                value={form.salePrice}
                onChange={handleChange}
                min="0"
                placeholder="3999"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                placeholder="20"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Product Image
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                  setImageFile(e.target.files[0] || null);
                  }}
                  className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm"
                />

              <p className="mt-2 text-xs text-gray-500">
                  JPG, JPEG, PNG or WEBP. Maximum size: 5MB.
              </p>
              </div>

            {/* Sizes */}
            <div className="md:col-span-2">
              <label className="mb-3 block text-sm font-medium">
                Available Sizes *
              </label>

              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((size) => (
                  <button
                    type="button"
                    key={size}
                    onClick={() => handleSizeChange(size)}
                    className={`rounded-lg border px-5 py-2 text-sm font-medium ${
                      form.sizes.includes(size)
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe the product..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="md:col-span-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="md:col-span-2 rounded-lg bg-green-50 p-3 text-sm text-green-600">
                {success}
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-black px-8 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? editingId !== null
                    ? "Updating Product..."
                    : "Adding Product..."
                  : editingId !== null
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>

          </form>
        </section>

        {/* =========================
            PRODUCT LIST
            ========================= */}
        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-semibold text-gray-900">
            Existing Products
          </h2>

          {loading ? (
            <p className="mt-6 text-gray-500">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="mt-6 text-gray-500">
              No products available.
            </p>
          ) : (
            <div className="mt-6">

              {/* =========================
                  DESKTOP TABLE
                  ========================= */}
              <div className="hidden overflow-x-auto md:block">

                <table className="w-full text-left">

                  <thead>
                    <tr className="border-b border-gray-200 text-sm text-gray-500">
                      <th className="px-4 py-3">
                        Product
                      </th>

                      <th className="px-4 py-3">
                        Category
                      </th>

                      <th className="px-4 py-3">
                        Price
                      </th>

                      <th className="px-4 py-3">
                        Stock
                      </th>

                      <th className="px-4 py-3">
                        Sizes
                      </th>

                      <th className="px-4 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {products.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gray-100"
                      >

                        {/* Product */}
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">

                            <img
                              src={getImageUrl(product.image)}
                              alt={product.name}
                              className="h-14 w-12 rounded-lg object-cover"
                            />

                            <span className="font-medium">
                              {product.name}
                            </span>

                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {product.category}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 text-sm">
                          ₹
                          {(product.salePrice ?? product.price).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-4 text-sm">
                          {product.stock}
                        </td>

                        {/* Sizes */}
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {product.sizes.join(", ")}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-4">

                          <div className="flex gap-2">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(product)
                              }
                              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(product.id)
                              }
                              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>

              {/* =========================
                  MOBILE PRODUCT CARDS
                  ========================= */}
              <div className="space-y-4 md:hidden">

                {products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >

                    {/* Product Image + Name */}
                    <div className="flex items-center gap-4">

                      <img
                        src={getImageUrl(product.image)}
                        alt={product.name}
                        className="h-20 w-16 flex-shrink-0 rounded-lg object-cover"
                      />

                      <div className="min-w-0">

                        <h3 className="text-base font-semibold text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.category}
                        </p>

                      </div>

                    </div>

                    {/* Product Information */}
                    <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">

                      {/* Price */}
                      <div>
                        <p className="text-xs text-gray-500">
                          Price
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          ₹
                          {(product.salePrice ?? product.price).toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </div>

                      {/* Stock */}
                      <div>
                        <p className="text-xs text-gray-500">
                          Stock
                        </p>

                        <p className="mt-1 text-sm font-medium text-gray-900">
                          {product.stock}
                        </p>
                      </div>

                      {/* Sizes */}
                      <div className="col-span-2">

                        <p className="text-xs text-gray-500">
                          Available Sizes
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {product.sizes.join(", ")}
                        </p>

                      </div>

                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-3 border-t border-gray-100 pt-4">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(product)
                        }
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition hover:border-black"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                        className="flex-1 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-100"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>

            </div>
          )}

        </section>

{/* =========================
    ORDERS
    ========================= */}
<section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <p className="text-sm tracking-[0.2em] text-gray-500">
        AURA ADMIN
      </p>

      <h2 className="mt-1 text-2xl font-semibold text-gray-900">
        Customer Orders
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        View and manage customer orders.
      </p>
    </div>

    <button
      type="button"
      onClick={fetchOrders}
      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-black"
    >
      Refresh Orders
    </button>
  </div>

  {/* Error */}
  {ordersError && (
    <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
      {ordersError}
    </div>
  )}

  {/* Loading */}
  {ordersLoading ? (
    <p className="mt-6 text-gray-500">
      Loading orders...
    </p>
  ) : orders.length === 0 ? (
    <div className="mt-6 rounded-xl border border-dashed border-gray-300 p-8 text-center">
      <p className="font-medium text-gray-900">
        No orders yet
      </p>

      <p className="mt-1 text-sm text-gray-500">
        Customer orders will appear here.
      </p>
    </div>
  ) : (
    <div className="mt-6 space-y-5">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-gray-200 p-5"
        >
          {/* Order Header */}
          <div className="flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Order
              </p>

              <h3 className="mt-1 text-lg font-semibold text-gray-900">
                #{order.id}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString(
                  "en-IN",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )}
              </p>
            </div>

            {/* Status */}
            <div className="sm:text-right">
              <label className="block text-xs text-gray-500">
                Order Status
              </label>

              <select
                value={order.status}
                disabled={updatingOrderId === order.id}
                onChange={(e) =>
                  handleOrderStatusChange(
                    order.id,
                    e.target.value
                  )
                }
                className="mt-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium outline-none focus:border-black disabled:opacity-50"
              >
                <option value="Pending">
                  Pending
                </option>

                <option value="Confirmed">
                  Confirmed
                </option>

                <option value="Shipped">
                  Shipped
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

              {updatingOrderId === order.id && (
                <p className="mt-1 text-xs text-gray-500">
                  Updating...
                </p>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Customer
              </p>

              <p className="mt-1 font-medium text-gray-900">
                {order.customerName}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {order.email}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                {order.phone}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400">
                Delivery Address
              </p>

              <p className="mt-1 text-sm leading-6 text-gray-600">
                {order.address}
                <br />
                {order.city}, {order.state}
                <br />
                {order.pincode}
              </p>
            </div>
          </div>

          {/* Products */}
          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Products
            </p>

            <div className="mt-3 space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Size: {item.size} · Quantity:{" "}
                      {item.quantity}
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
          </div>

          {/* Total */}
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-5">
            <span className="font-medium text-gray-600">
              Order Total
            </span>

            <span className="text-xl font-semibold text-gray-900">
              ₹
              {order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</section>        

      </div>
    </main>
  );
}

export default Admin;