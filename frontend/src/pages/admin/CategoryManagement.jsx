import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Search, 
  MoreHorizontal,
  ChevronRight,
  LayoutGrid,
  List
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
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into logical groups and hierarchies.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

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
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="VD: iPhone 16 Series"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground ml-1">Mô tả</label>
                  <textarea 
                    className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[100px]"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="h-64 bg-card animate-pulse rounded-3xl border border-border" />
          ))
        ) : (
          filteredCategories.map((cat) => (
            <motion.div 
              whileHover={{ y: -5 }}
              key={cat._id} 
              className="bg-card p-6 rounded-3xl border border-border group cursor-pointer hover:shadow-xl hover:shadow-primary/5 transition-all"
            >
               <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                     <Layers className="w-6 h-6" />
                  </div>
                  <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                     <MoreHorizontal className="w-4 h-4" />
                  </button>
               </div>
               <h3 className="text-xl font-bold text-elppa-obsidian">{cat.name}</h3>
               <p className="text-xs text-muted-foreground font-medium mt-1">/{cat.slug}</p>
               
               <div className="mt-8 flex items-end justify-between">
                  <div>
                     <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Products</p>
                     <p className="text-2xl font-bold tracking-tight">{cat.count || 0}</p>
                  </div>
                  <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                     Manage Items <ChevronRight className="w-3 h-3" />
                  </div>
               </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search categories..." 
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
    </div>
  );
};

export default CategoryManagement;
