import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { apiRequest } from '../services/api/client';
import { motion } from 'framer-motion';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (result.success) {
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed');
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-[400px] text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-elppa-obsidian mb-2">Tạo tài khoản.</h1>
          <p className="text-elppa-gray mb-10">Một tài khoản cho tất cả mọi thứ ELPPA.</p>

          <form onSubmit={handleRegister} className="space-y-4">
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
            <input 
              type="password" 
              placeholder="Xác nhận mật khẩu" 
              className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <button 
              type="submit" 
              className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mt-6"
            >
              Tiếp tục
            </button>
          </form>

          <div className="mt-8 text-sm text-elppa-gray">
            Đã có tài khoản? <Link to="/login" className="text-elppa-blue hover:underline">Hãy đăng nhập.</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

export default Register;