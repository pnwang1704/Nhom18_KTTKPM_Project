import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import CategoryPage from '../pages/CategoryPage';
import Support from '../pages/Support';
import Store from '../pages/Store';
import ProductDetail from '../pages/ProductDetail';
import ForgotPassword from '../pages/ForgotPassword';
import Account from '../pages/Account';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/account" element={<Account />} />
      <Route path="/category/:brand" element={<CategoryPage />} />
      <Route path="/support" element={<Support />} />
      <Route path="/store" element={<Store />} />
      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;