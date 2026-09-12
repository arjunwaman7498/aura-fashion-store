import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.identifier || !form.password) {
      setError("Please enter your email/username and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://192.168.1.14:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // ADMIN LOGIN
      if (data.role === "admin") {
        localStorage.removeItem("customerToken");
        localStorage.removeItem("customer");

        localStorage.setItem("adminToken", data.token);

        navigate("/admin");
        return;
      }

      // CUSTOMER LOGIN
      if (data.role === "customer") {
        localStorage.removeItem("adminToken");

        localStorage.setItem("customerToken", data.token);
        localStorage.setItem("customer", JSON.stringify(data.user));

        navigate("/");
        return;
      }

      throw new Error("Invalid login response");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[80vh] bg-[#faf9f7] px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm sm:p-8">
        <div className="text-center">
          <p className="text-sm tracking-[0.3em] text-gray-500">
            AURA
          </p>

          <h1 className="mt-2 text-3xl font-semibold text-gray-900">
            Welcome Back
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to your account
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email or Username
            </label>

            <input
              type="text"
              name="identifier"
              value={form.identifier}
              onChange={handleChange}
              placeholder="you@example.com or admin"
              autoComplete="username"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-black hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}

export default Login;