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

const categories = [
  { id: 1, name: 'iPhone', slug: 'iphone', count: 42, status: 'Active', lastUpdate: '2024-05-10' },
  { id: 2, name: 'iPad', slug: 'ipad', count: 28, status: 'Active', lastUpdate: '2024-05-08' },
  { id: 3, name: 'Samsung', slug: 'samsung', count: 35, status: 'Active', lastUpdate: '2024-05-11' },
  { id: 4, name: 'Xiaomi', slug: 'xiaomi', count: 18, status: 'Active', lastUpdate: '2024-05-09' },
  { id: 5, name: 'Oppo', slug: 'oppo', count: 22, status: 'Active', lastUpdate: '2024-05-07' },
  { id: 6, name: 'Accessories', slug: 'accessories', count: 156, status: 'Inactive', lastUpdate: '2024-04-20' },
];

const CategoryManagement = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground mt-1">Organize your products into logical groups and hierarchies.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <motion.div 
            whileHover={{ y: -5 }}
            key={cat.id} 
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
                   <p className="text-2xl font-bold tracking-tight">{cat.count}</p>
                </div>
                <div className="flex items-center gap-1 text-primary text-xs font-bold group-hover:gap-2 transition-all">
                   Manage Items <ChevronRight className="w-3 h-3" />
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search categories..." 
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
