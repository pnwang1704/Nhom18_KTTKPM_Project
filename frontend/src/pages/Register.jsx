import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { apiRequest } from '../services/api/client';
import { motion, AnimatePresence } from 'framer-motion';

function Register() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  
  const [error, setError] = useState('');
  const [needsOTP, setNeedsOTP] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    try {
      const response = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, birthday, phoneNumber, fullName })
      });
      const result = await response.json();
      if (result.success) {
        setNeedsOTP(true);
      } else {
        setError(result.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyRegistration = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/verify-registration', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.message || 'Mã xác thực không chính xác');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-elppa-light min-h-screen">
        <Navbar />
        <main className="flex items-center justify-center pt-48 px-gutter text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
               </svg>
            </div>
            <h1 className="text-3xl font-bold text-elppa-obsidian mb-4">Đăng ký thành công!</h1>
            <p className="text-elppa-gray">Tài khoản của bạn đã được xác thực. Đang chuyển hướng đến trang đăng nhập...</p>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-elppa-light min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center pt-32 pb-16 px-gutter">
        <div className="w-full max-w-[400px] text-center">
          <AnimatePresence mode="wait">
            {!needsOTP ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full"
              >
                <h1 className="text-3xl md:text-4xl font-bold text-elppa-obsidian mb-2">Tạo tài khoản.</h1>
                <p className="text-elppa-gray mb-10">Một tài khoản cho tất cả mọi thứ ELPPA.</p>

                <form onSubmit={handleRegister} className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Họ và tên" 
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input 
                    type="email" 
                    placeholder="Email của bạn" 
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                     <input 
                       type="date" 
                       className="px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white text-elppa-gray"
                       value={birthday}
                       onChange={(e) => setBirthday(e.target.value)}
                       required
                     />
                     <input 
                       type="tel" 
                       placeholder="Số điện thoại" 
                       className="px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white font-mono"
                       value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)}
                       required
                     />
                  </div>
                  <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <input 
                    type="password" 
                    placeholder="Xác nhận mật khẩu" 
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue focus:ring-1 focus:ring-elppa-blue outline-none transition-all bg-white"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <button 
                    disabled={loading}
                    type="submit" 
                    className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors mt-6 shadow-lg shadow-blue-500/20 disabled:bg-gray-400"
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                  </button>
                </form>

                <div className="mt-8 text-sm text-elppa-gray">
                  Đã có tài khoản? <Link to="/login" className="text-elppa-blue hover:underline">Hãy đăng nhập.</Link>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full"
              >
                <h1 className="text-3xl font-bold text-elppa-obsidian mb-2">Xác thực Email</h1>
                <p className="text-elppa-gray mb-8">Chúng tôi đã gửi mã OTP 6 số đến <b>{email}</b>. Vui lòng nhập mã để hoàn tất đăng ký.</p>
                
                <form onSubmit={handleVerifyRegistration} className="space-y-4">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="123456"
                    className="w-full px-4 py-4 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none text-center text-3xl font-bold tracking-[10px]"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Đang xác thực...' : 'Xác thực tài khoản'}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => setNeedsOTP(false)}
                    className="text-sm text-elppa-gray hover:text-elppa-blue"
                  >
                    Quay lại sửa thông tin
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default Register;