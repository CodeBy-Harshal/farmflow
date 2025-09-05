import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AIChat from "./pages/AIChat";
import CropAnalysis from "./pages/CropAnalysis";
import ProtectedRoute from "./components/ProtectedRoute";

// Farmer pages
import Dashboard from "./pages/farmer/Dashboard";
import MyProducts from "./pages/farmer/MyProducts";
import AddProduct from "./pages/farmer/AddProduct";
import MySales from "./pages/farmer/MySales";

// Buyer pages
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import Marketplace from "./pages/buyer/Marketplace";
import MyOrders from "./pages/buyer/MyOrders";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/Users";
import ManageProducts from "./pages/admin/Products";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
          <Header />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={<HomePage />} /> {/* fallback */}

              {/* Farmer-only */}
              <Route
                path="/farmer/dashboard"
                element={
                  <ProtectedRoute roles={["FARMER"]}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/my-products"
                element={
                  <ProtectedRoute roles={["FARMER"]}>
                    <MyProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/add-product"
                element={
                  <ProtectedRoute roles={["FARMER"]}>
                    <AddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/farmer/my-sales"
                element={
                  <ProtectedRoute roles={["FARMER"]}>
                    <MySales />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crop-analysis"
                element={
                  <ProtectedRoute roles={["FARMER"]}>
                    <CropAnalysis />
                  </ProtectedRoute>
                }
              />

              {/* Buyer-only */}
              <Route
                path="/buyer/dashboard"
                element={
                  <ProtectedRoute roles={["BUYER"]}>
                    <BuyerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marketplace"
                element={
                  <ProtectedRoute roles={["BUYER"]}>
                    <Marketplace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/buyer/my-orders"
                element={
                  <ProtectedRoute roles={["BUYER"]}>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />

              {/* Shared: AI Chat for FARMER + BUYER */}
              <Route
                path="/ai-chat"
                element={
                  <ProtectedRoute roles={["FARMER", "BUYER"]}>
                    <AIChat />
                  </ProtectedRoute>
                }
              />

              {/* Admin-only */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <ManageUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <ManageProducts />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
