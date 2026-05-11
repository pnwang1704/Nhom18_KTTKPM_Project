import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { apiRequest } from '../services/api/client';
import { motion, AnimatePresence } from 'framer-motion';

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      if (result.success) {
        setStep(2);
      } else {
        setError(result.message || 'Không thể gửi mã OTP');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();
      if (result.success) {
        setStep(3);
      } else {
        setError(result.message || 'Mã OTP không hợp lệ');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword })
      });
      const result = await response.json();
      if (result.success) {
        setStep(4);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(result.message || 'Đặt lại mật khẩu thất bại');
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-elppa-light min-h-screen">
      <Navbar />
      <main className="flex items-center justify-center pt-32 px-gutter">
        <div className="w-full max-w-[400px] text-center">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-elppa-obsidian mb-2">Quên mật khẩu?</h1>
                <p className="text-elppa-gray mb-8">Nhập email của bạn để nhận mã xác thực OTP.</p>
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email đã đăng ký"
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-elppa-obsidian mb-2">Nhập mã OTP</h1>
                <p className="text-elppa-gray mb-8">Chúng tôi đã gửi mã 6 số đến <b>{email}</b></p>
                <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                    type="submit"
                    className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                  >
                    Tiếp tục
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="text-sm text-elppa-gray hover:text-elppa-blue"
                  >
                    Thay đổi email
                  </button>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h1 className="text-3xl font-bold text-elppa-obsidian mb-2">Mật khẩu mới</h1>
                <p className="text-elppa-gray mb-8">Vui lòng nhập mật khẩu mới cho tài khoản của bạn.</p>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Xác nhận mật khẩu"
                    className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-elppa-blue text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12"
              >
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-elppa-obsidian mb-2">Thành công!</h1>
                <p className="text-elppa-gray mb-8">Mật khẩu của bạn đã được cập nhật. Đang chuyển hướng về trang đăng nhập...</p>
                <Link to="/login" className="text-elppa-blue font-bold">Quay về Đăng nhập ngay</Link>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
             <div className="mt-8">
               <Link to="/login" className="text-sm text-elppa-gray hover:text-elppa-blue">Quay lại trang Đăng nhập</Link>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ForgotPassword;
