import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingBag, Menu } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-elppa-gray-border/50">
      <div className="max-w-[1200px] mx-auto h-12 flex items-center justify-between px-gutter">
        {/* Menu Icon for Mobile */}
        <button className="md:hidden text-elppa-obsidian hover:opacity-70 transition-opacity">
          <Menu size={18} />
        </button>

        {/* Logo / Home Link */}
        <Link to="/" className="text-elppa-obsidian font-semibold tracking-tight hover:opacity-70 transition-opacity uppercase">
          ELPPA
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6 text-[11px] font-medium text-elppa-gray">
          <Link to="/store" className="hover:text-elppa-obsidian transition-colors">Cửa hàng</Link>
          <Link to="/category/iphone" className="hover:text-elppa-obsidian transition-colors">iPhone</Link>
          <Link to="/category/ipad" className="hover:text-elppa-obsidian transition-colors">iPad</Link>
          <Link to="/category/samsung" className="hover:text-elppa-obsidian transition-colors">Samsung</Link>
          <Link to="/category/xiaomi" className="hover:text-elppa-obsidian transition-colors">Xiaomi</Link>
          <Link to="/category/oppo" className="hover:text-elppa-obsidian transition-colors">Oppo</Link>
          <Link to="/support" className="hover:text-elppa-obsidian transition-colors">Hỗ trợ</Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-5 text-elppa-gray">
          <button className="hover:text-elppa-obsidian transition-colors">
            <Search size={16} />
          </button>
          <button className="hover:text-elppa-obsidian transition-colors relative">
            <ShoppingBag size={16} />
            <span className="absolute -top-1 -right-1 bg-elppa-blue text-white text-[10px] w-3 h-3 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
          <Link to="/login" className="hover:text-elppa-obsidian transition-colors">
            <span className="text-[11px] font-medium">Tài khoản</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
