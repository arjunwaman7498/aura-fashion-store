import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function ProtectedCustomer({ children }) {
  const token = localStorage.getItem("customerToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedCustomer> <Checkout /> </ProtectedCustomer> }/>
        <Route path="/orders" element={<ProtectedCustomer> <Orders /> </ProtectedCustomer>}/>
        <Route path="/wishlist" element={<ProtectedCustomer> <Wishlist /> </ProtectedCustomer>}/>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Login */}
        <Route
          path="/admin"
          element={
         <ProtectedAdmin>
         <Admin />
         </ProtectedAdmin>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;