import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Plus,
  Search,
  MoreHorizontal,
  ChevronRight,
  LayoutGrid,
  List,
  ArrowLeft,
  Box,
  TrendingUp,
  AlertCircle,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

import { useState, useEffect } from 'react';
import { apiRequest } from '../../services/api/client';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', status: 'Active' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await apiRequest('/api/categories');
      const result = await res.json();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    setIsSubmitting(true);
    try {
      const res = await apiRequest(`/api/categories/${categoryToDelete._id}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
        fetchCategories();
      } else {
        alert(result.message || 'Lỗi khi xóa danh mục');
      }
    } catch (err) {
      console.error('Delete category error:', err);
      alert('Đã có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchProductsByCategory = async (category) => {
    setSelectedCategory(category);
    setLoadingProducts(true);
    try {
      const res = await apiRequest(`/api/products?category=${category.slug}&limit=100`);
      const result = await res.json();
      if (result.success) {
        // API trả về trực tiếp { products, pagination }
        setCategoryProducts(result.products || []);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Tạo slug tự động
      const slug = formData.name.toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');

      const res = await apiRequest('/api/categories', {
        method: 'POST',
        body: JSON.stringify({ ...formData, slug })
      });

      const result = await res.json();
      if (result.success) {
        setIsModalOpen(false);
        setFormData({ name: '', description: '', status: 'Active' });
        fetchCategories(); // Reload list
      } else {
        alert(result.message || 'Lỗi khi thêm danh mục');
      }
    } catch (err) {
      console.error('Add category error:', err);
      alert('Đã có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {selectedCategory ? `Sản phẩm thuộc ${selectedCategory.name}` : 'Danh mục sản phẩm'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedCategory
              ? `Đang xem tất cả các mặt hàng thuộc danh mục ${selectedCategory.name}.`
              : 'Quản lý và tổ chức các sản phẩm của bạn theo nhóm.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh mục
            </button>
          )}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* View Switcher */}
      <motion.div
        key={selectedCategory ? 'products' : 'categories'}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!selectedCategory ? (
          /* CATEGORIES GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-card animate-pulse rounded-3xl border border-border" />
              ))
            ) : (
              filteredCategories.map((cat) => (
                <motion.div
                  whileHover={{ y: -5 }}
                  key={cat._id}
                  onClick={() => fetchProductsByCategory(cat)}
                  className="bg-card p-6 rounded-3xl border border-border group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCategoryToDelete(cat);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-rose-50 text-muted-foreground hover:text-rose-600 transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-elppa-obsidian">{cat.name}</h3>

                  <div className="mt-8 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Sản phẩm</p>
                      <p className="text-2xl font-bold tracking-tight">{cat.count || 0}</p>
                    </div>
                    <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                      Xem chi tiết <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        ) : (
          /* PRODUCTS LIST FOR SELECTED CATEGORY */
          <div className="bg-card rounded-[32px] border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Sản phẩm</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Giá bán</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Tồn kho</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Trạng thái</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loadingProducts ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan="5" className="px-6 py-8"><div className="h-12 bg-muted/50 rounded-2xl w-full" /></td>
                      </tr>
                    ))
                  ) : categoryProducts.length > 0 ? (
                    categoryProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden flex-shrink-0 border border-border/50">
                              {product.image || (product.images && product.images.length > 0) ? (
                                <img
                                  src={product.image || product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/50">
                                  <Box className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-elppa-obsidian">{product.name}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "w-2 h-2 rounded-full",
                              product.stock > 10 ? "bg-emerald-500" : product.stock > 0 ? "bg-amber-500" : "bg-red-500"
                            )} />
                            <span className="font-medium">{product.stock} máy</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            product.stock > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                          )}>
                            {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-primary transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                            <Box className="w-8 h-8" />
                          </div>
                          <div className="font-bold text-lg">Không tìm thấy sản phẩm</div>
                          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                            Danh mục này hiện chưa có sản phẩm. Hãy bắt đầu thêm sản phẩm để hiển thị tại đây.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* SEARCH & FILTERS (Only show for Categories view) */}
      {!selectedCategory && (
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              />
            </div>
            <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border">
              <button className="p-1.5 rounded-lg bg-card shadow-sm text-primary transition-all"><LayoutGrid className="w-4 h-4" /></button>
              <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-all"><List className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-card w-full max-w-lg rounded-[32px] shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold mb-6">Thêm danh mục mới</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Tên danh mục</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    placeholder="VD: iPhone 16 Series"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Mô tả</label>
                  <textarea
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px] text-foreground"
                    placeholder="Nhập mô tả ngắn về danh mục..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-card w-full max-w-md rounded-[32px] shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-elppa-obsidian">Xác nhận xóa?</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Bạn có chắc chắn muốn xóa danh mục <span className="font-bold text-elppa-obsidian">"{categoryToDelete?.name}"</span>?
                Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm thuộc danh mục này.
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xóa...' : 'Xóa ngay'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
