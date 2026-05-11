import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { apiRequest } from '../services/api/client';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.success) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        navigate('/');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="bg-elppa-light min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center pt-32 px-gutter">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-elppa-obsidian mb-2">Đăng nhập.</h1>
          <p className="text-elppa-gray mb-10">Sử dụng tài khoản ELPPA của bạn để tiếp tục.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="flex justify-end">
              <Link to="/forgot-password" virtual-link="forgot-password" className="text-xs text-elppa-blue hover:underline">Quên mật khẩu?</Link>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mt-6"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-8 text-sm text-elppa-gray">
            Chưa có tài khoản? <Link to="/register" className="text-elppa-blue hover:underline">Tạo tài khoản ngay.</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Login;