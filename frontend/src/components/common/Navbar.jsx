import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiRequest } from '../../services/api/client';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Logic tìm kiếm thực tế
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        try {
          const response = await apiRequest(`/api/products?search=${searchQuery}`);
          const result = await response.json();
          // Lấy danh sách sản phẩm từ trường .products hoặc .data
          const products = result.products || result.data || (Array.isArray(result) ? result : []);
          setSearchResults(products.slice(0, 6)); // Lấy tối đa 6 kết quả
        } catch (error) {
          console.error('Search failed:', error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const handleProductClick = (productId) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] glass border-b border-elppa-gray-border/50">
        <div className="max-w-[1250px] mx-auto h-12 flex items-center justify-between px-gutter">
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
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-elppa-obsidian transition-colors"
            >
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
                <Link to="/account" className="text-[11px] font-semibold text-elppa-obsidian hover:text-elppa-blue transition-colors">
                  Hi, {user.fullName}
                </Link>
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

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-white/95 backdrop-blur-xl flex flex-col pt-16 px-gutter"
          >
            <div className="max-w-[800px] mx-auto w-full">
              <div className="flex items-center gap-4 border-b-2 border-elppa-blue pb-4">
                <Search className="text-elppa-gray" size={24} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="bg-transparent border-none outline-none text-2xl w-full text-elppa-obsidian font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => setIsSearchOpen(false)}>
                  <X className="text-elppa-gray hover:text-elppa-obsidian transition-colors" size={24} />
                </button>
              </div>

              <div className="mt-12">
                <h3 className="text-xs font-bold text-elppa-gray uppercase tracking-widest mb-6">Kết quả tìm kiếm</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {searchResults.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={product._id}
                      onClick={() => handleProductClick(product._id)}
                      className="flex items-center gap-6 p-4 rounded-3xl hover:bg-elppa-light cursor-pointer group transition-all"
                    >
                      <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-sm border border-black/5">
                        <img 
                          src={product.image || (product.variants && product.variants[0]?.images[0])} 
                          alt="" 
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-elppa-obsidian">{product.name}</h4>
                        <p className="text-sm text-elppa-gray">Từ {product.price?.toLocaleString()}đ</p>
                      </div>
                    </motion.div>
                  ))}
                  {searchQuery.length > 1 && searchResults.length === 0 && (
                    <p className="text-elppa-gray font-medium">Không tìm thấy sản phẩm nào khớp với từ khóa.</p>
                  )}
                  {searchQuery.length <= 1 && (
                    <p className="text-elppa-gray font-medium italic">Nhập ít nhất 2 ký tự để tìm kiếm...</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
