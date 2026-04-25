import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu } from 'lucide-react';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-elppa-gray-border/50">
      <div className="max-w-[1250px] mx-auto h-12 flex items-center justify-between px-gutter">
        {/* ... (rest of logo and desktop links) ... */}
        <div className="flex md:hidden text-elppa-obsidian">
          <Menu size={18} />
        </div>

        <Link to="/" className="text-elppa-obsidian font-semibold tracking-tight uppercase">
          ELPPA
        </Link>

        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-elppa-gray">
          <Link to="/store" className="hover:text-elppa-obsidian transition-colors">Cửa hàng</Link>
          <Link to="/category/iphone" className="hover:text-elppa-obsidian transition-colors">iPhone</Link>
          <Link to="/category/ipad" className="hover:text-elppa-obsidian transition-colors">iPad</Link>
          <Link to="/category/samsung" className="hover:text-elppa-obsidian transition-colors">Samsung</Link>
          <Link to="/category/xiaomi" className="hover:text-elppa-obsidian transition-colors">Xiaomi</Link>
          <Link to="/category/oppo" className="hover:text-elppa-obsidian transition-colors">Oppo</Link>
          <Link to="/support" className="hover:text-elppa-obsidian transition-colors">Hỗ trợ</Link>
        </div>

        <div className="flex items-center gap-5 text-elppa-gray">
          <button className="hover:text-elppa-obsidian transition-colors">
            <Search size={16} />
          </button>
          <button className="hover:text-elppa-obsidian transition-colors relative">
            <ShoppingBag size={16} />
            <span className="absolute -top-1 -right-1 bg-elppa-blue text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </button>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-[11px] font-semibold text-elppa-obsidian">Hi, {user.fullName}</span>
              <button 
                onClick={handleLogout}
                className="text-[10px] uppercase tracking-wider font-bold text-red-500 hover:text-red-600 transition-colors"
                title="Đăng xuất"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link to="/login" className="hover:text-elppa-obsidian transition-colors">
              <span className="text-[11px] font-medium">Tài khoản</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
