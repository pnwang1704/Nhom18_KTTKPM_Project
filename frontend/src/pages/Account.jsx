import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { apiRequest } from "../services/api/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Lock,
  Calendar,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  CheckCircle,
} from "lucide-react";
import { orderApi } from "../services/api/orderApi";

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) return null;

  // Personal Info states
  const [fullName, setFullName] = useState(user.fullName || "");
  const [birthday, setBirthday] = useState(
    user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "",
  );
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

  // Password states
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState({ profile: false, password: false });
  const [message, setMessage] = useState({ type: "", text: "", section: "" });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, profile: true }));
    setMessage({ type: "", text: "", section: "" });

    try {
      const response = await apiRequest("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ fullName, birthday, phoneNumber }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({
          type: "success",
          text: "Cập nhật thông tin thành công!",
          section: "profile",
        });
        localStorage.setItem("user", JSON.stringify(result.data));
        setUser(result.data);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Cập nhật thất bại",
          section: "profile",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Lỗi kết nối máy chủ",
        section: "profile",
      });
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: "Vui lòng điền đầy đủ các trường mật khẩu",
        section: "password",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Mật khẩu mới và xác nhận không khớp",
        section: "password",
      });
      return;
    }

    setLoading((prev) => ({ ...prev, password: true }));
    setMessage({ type: "", text: "", section: "" });

    try {
      const response = await apiRequest("/api/auth/me", {
        method: "PATCH",
        body: JSON.stringify({ password: newPassword, oldPassword }),
      });

      const result = await response.json();
      if (result.success) {
        setMessage({
          type: "success",
          text: "Đổi mật khẩu thành công!",
          section: "password",
        });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setShowPasswordForm(false), 2000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Đổi mật khẩu thất bại",
          section: "password",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "Lỗi kết nối máy chủ",
        section: "password",
      });
    } finally {
      setLoading((prev) => ({ ...prev, password: false }));
    }
  };

  return (
    <div className="bg-elppa-gray-subtle min-h-screen">
      <Navbar />

      <main className="pt-24 pb-20 px-gutter">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl font-bold text-elppa-obsidian mb-2">
              Thông tin tài khoản.
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Avatar Card */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-black/5 flex flex-col items-center text-center sticky top-24">
                <div className="w-24 h-24 bg-gradient-to-br from-elppa-blue to-blue-400 text-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                  <User size={48} />
                </div>
                <h2 className="text-xl font-bold text-elppa-obsidian">
                  {user.fullName}
                </h2>
                <p className="text-sm text-elppa-gray mb-6">{user.email}</p>

                <div className="w-full pt-6 border-t border-elppa-gray-border flex flex-col gap-4 text-left">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-elppa-gray font-bold mb-1">
                      Trạng thái
                    </p>
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                      <CheckCircle size={14} /> Đã xác thực
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-elppa-gray font-bold mb-1">
                      Thành viên từ
                    </p>
                    <p className="text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Forms */}
            <div className="md:col-span-2 space-y-6">
              {/* Profile Form Section */}
              <section className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-elppa-blue">
                      <User size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-elppa-obsidian">
                      Thông tin cá nhân
                    </h3>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                          Địa chỉ Email
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-elppa-gray-subtle rounded-xl text-elppa-gray border border-elppa-gray-border/50 cursor-not-allowed">
                          <Mail size={16} />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <p className="text-[10px] text-elppa-gray mt-2 ml-1">
                          * Email được dùng để đăng nhập và không thể thay đổi.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                            Họ và tên
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                            Số điện thoại
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                          value={birthday}
                          onChange={(e) => setBirthday(e.target.value)}
                        />
                      </div>
                    </div>

                    {message.section === "profile" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                      >
                        {message.text}
                      </motion.div>
                    )}

                    <div className="pt-4">
                      <button
                        disabled={loading.profile}
                        type="submit"
                        className="px-8 py-3 bg-elppa-blue text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 disabled:bg-gray-400"
                      >
                        {loading.profile ? "Đang lưu..." : "Lưu thông tin"}
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              {/* Orders Section */}
              <section className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-elppa-blue">
                      <Calendar size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-elppa-obsidian">
                      Lịch sử đơn hàng
                    </h3>
                  </div>

                  <OrdersList />
                </div>
              </section>

              {/* Password Section */}
              <section className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
                <div className="p-8">
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="w-full flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                        <Lock size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-elppa-obsidian">
                        Mật khẩu & Bảo mật
                      </h3>
                    </div>
                    {showPasswordForm ? (
                      <ChevronUp size={20} className="text-elppa-gray" />
                    ) : (
                      <ChevronDown size={20} className="text-elppa-gray" />
                    )}
                  </button>

                  <AnimatePresence>
                    {showPasswordForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <form
                          onSubmit={handleChangePassword}
                          className="pt-8 space-y-6"
                        >
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                                Mật khẩu hiện tại
                              </label>
                              <input
                                type="password"
                                className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                              />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                                  Mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                                  value={newPassword}
                                  onChange={(e) =>
                                    setNewPassword(e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-elppa-gray uppercase tracking-widest mb-2 ml-1">
                                  Xác nhận mật khẩu mới
                                </label>
                                <input
                                  type="password"
                                  className="w-full px-4 py-3 rounded-xl border border-elppa-gray-border focus:border-elppa-blue outline-none transition-all font-medium bg-elppa-light/50 focus:bg-white"
                                  value={confirmPassword}
                                  onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          {message.section === "password" && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                            >
                              {message.text}
                            </motion.div>
                          )}

                          <div className="pt-2">
                            <button
                              disabled={loading.password}
                              type="submit"
                              className="px-8 py-3 bg-elppa-obsidian text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg disabled:bg-gray-400"
                            >
                              {loading.password
                                ? "Đang cập nhật..."
                                : "Cập nhật mật khẩu"}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Account;

function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await orderApi.getMyOrders();
        if (mounted && res && res.data) setOrders(res.data);
      } catch (err) {
        if (mounted) setError(err.message || "Lỗi tải đơn hàng");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <p className="text-sm text-muted-foreground">Đang tải đơn hàng...</p>
    );
  if (error) return <p className="text-sm text-rose-600">{error}</p>;
  if (!orders || orders.length === 0)
    return (
      <p className="text-sm text-muted-foreground">Bạn chưa có đơn hàng nào.</p>
    );

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div
          key={o._id}
          className="p-4 border rounded-xl hover:shadow-sm transition-shadow"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">Mã đơn</p>
              <p className="font-bold">#{String(o._id).slice(-8)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Tổng</p>
              <p className="font-bold">
                {Number(o.totalPrice || o.total || 0).toLocaleString()}đ
              </p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <div>
              Trạng thái:{" "}
              <span className="font-bold text-foreground ml-2">{o.status}</span>
            </div>
            <div>Ngày: {new Date(o.createdAt).toLocaleString("vi-VN")}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
