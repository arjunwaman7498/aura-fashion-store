import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const customerToken = localStorage.getItem("customerToken");
  const adminToken = localStorage.getItem("adminToken");

  const customer = JSON.parse(localStorage.getItem("customer") || "null");

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleCustomerLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");

    closeMenu();
    navigate("/login");
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");

    closeMenu();
    navigate("/login");
  };

  const isCustomerLoggedIn = Boolean(customerToken);
  const isAdminLoggedIn = Boolean(adminToken);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="text-2xl font-semibold tracking-wide"
          >
            AURA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Shop
            </Link>

            <Link
              to="/products?category=Sarees"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Sarees
            </Link>

            <Link
              to="/products?category=Kurtis"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Kurtis
            </Link>

            <Link
              to="/products?category=Dresses"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Dresses
            </Link>

            <Link
              to="/products?category=Lehengas"
              className="text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Lehengas
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-5 md:flex">

            <Link
              to="/products?focus=search"
              className="text-sm text-gray-700 transition hover:text-black"
            >
              Search
            </Link>

            {isCustomerLoggedIn && (
              <Link
                to="/orders"
                className="transition hover:text-gray-600"
              >
                My Orders
              </Link>
            )}            

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-sm text-gray-700 transition hover:text-black"
            >
              Wishlist
            </Link>

            {/* Login / Customer / Admin */}
            {isCustomerLoggedIn ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, {customer?.name || "Customer"}
                </span>

                <button
                  type="button"
                  onClick={handleCustomerLogout}
                  className="text-sm font-medium text-gray-700 transition hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : isAdminLoggedIn ? (
              <>
                <Link
                  to="/admin"
                  className="text-sm font-medium text-gray-700 transition hover:text-black"
                >
                  Admin
                </Link>

                <button
                  type="button"
                  onClick={handleAdminLogout}
                  className="text-sm font-medium text-gray-700 transition hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 transition hover:text-black"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="text-sm font-medium text-gray-700 transition hover:text-black"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-sm font-medium text-gray-700 transition hover:text-black"
            >
              Cart

              {cartCount > 0 && (
                <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-xs font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4 md:hidden">

            <Link
              to="/cart"
              className="relative text-sm font-medium text-gray-700"
            >
              Cart

              {cartCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-xs text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="mt-5 border-t border-gray-100 pt-5 md:hidden">
            <div className="flex flex-col gap-4">

              <Link
                to="/"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Shop
              </Link>

              <Link
                to="/products?category=Sarees"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Sarees
              </Link>

              <Link
                to="/products?category=Kurtis"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Kurtis
              </Link>

              <Link
                to="/products?category=Dresses"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Dresses
              </Link>

              <Link
                to="/products?category=Lehengas"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Lehengas
              </Link>

              <Link
                to="/products?focus=search"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Search
              </Link>

            {isCustomerLoggedIn && (
              <Link
                to="/orders"
                onClick={closeMenu}
                className="block py-2 transition hover:text-gray-600"
              >
                My Orders
              </Link>
            )}              

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="text-sm font-medium text-gray-700"
              >
                Wishlist
              </Link>

              {/* Mobile Authentication */}
              {isCustomerLoggedIn ? (
                <>
                  <span className="text-sm font-medium text-gray-600">
                    Hi, {customer?.name || "Customer"}
                  </span>

                  <button
                    type="button"
                    onClick={handleCustomerLogout}
                    className="text-left text-sm font-medium text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : isAdminLoggedIn ? (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-700"
                  >
                    Admin
                  </Link>

                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="text-left text-sm font-medium text-gray-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="text-sm font-medium text-gray-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;