import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CategoryPage from '../pages/CategoryPage';
import Support from '../pages/Support';
import Store from '../pages/Store';
import ProductDetail from '../pages/ProductDetail';
import ForgotPassword from '../pages/ForgotPassword';
import Account from '../pages/Account';

// Admin Imports
import AdminLayout from '../layouts/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import ProductManagement from '../pages/admin/ProductManagement';
import AddProduct from '../pages/admin/AddProduct';
import EditProduct from '../pages/admin/EditProduct';
import CategoryManagement from '../pages/admin/CategoryManagement';
import OrderManagement from '../pages/admin/OrderManagement';
import CustomerManagement from '../pages/admin/CustomerManagement';
import InventoryManagement from '../pages/admin/InventoryManagement';
import Promotions from '../pages/admin/Promotions';
import ReviewsManagement from '../pages/admin/ReviewsManagement';
import Analytics from '../pages/admin/Analytics';
import Settings from '../pages/admin/Settings';

import '../admin.css'; // Tailwind & Admin Styles

function App() {
  return (
    <Routes>
      {/* Customer Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/account" element={<Account />} />
      <Route path="/category/:brand" element={<CategoryPage />} />
      <Route path="/support" element={<Support />} />
      <Route path="/store" element={<Store />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="products/new" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="customers" element={<CustomerManagement />} />
        <Route path="inventory" element={<InventoryManagement />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="reviews" element={<ReviewsManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;