import React from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  Search, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Plus,
  Filter
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const inventoryData = [
  { id: 1, name: 'iPhone 15 Pro Max', sku: 'IP15PM-256-BLUE', stock: 45, status: 'Healthy', minStock: 20 },
  { id: 2, name: 'Samsung Galaxy S24 Ultra', sku: 'S24U-512-GRAY', stock: 12, status: 'Low Stock', minStock: 15 },
  { id: 3, name: 'iPad Pro M4', sku: 'IPAD-M4-1TB', stock: 5, status: 'Critical', minStock: 10 },
  { id: 4, name: 'Apple Watch Ultra 2', sku: 'AWU2-TITANIUM', stock: 28, status: 'Healthy', minStock: 5 },
  { id: 5, name: 'Xiaomi 14 Pro', sku: 'XM14P-256-BLK', stock: 0, status: 'Out of Stock', minStock: 10 },
];

const InventoryManagement = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Real-time stock monitoring and warehouse management.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <RefreshCcw className="w-4 h-4" />
            Update Stock
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            Receive Items
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: '4,281', color: 'text-primary' },
          { label: 'Low Stock', value: '12', color: 'text-orange-600' },
          { label: 'Out of Stock', value: '3', color: 'text-rose-600' },
          { label: 'Valuation', value: '$842,000', color: 'text-primary' },
        ].map((item) => (
          <div key={item.label} className="bg-card p-6 rounded-3xl border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{item.label}</p>
            <p className={cn("text-2xl font-bold mt-2 tracking-tight", item.color)}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter by SKU or name..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Filter className="w-4 h-4 text-muted-foreground" />
            Stock Status
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5">SKU</th>
                <th className="px-8 py-5">Inventory</th>
                <th className="px-8 py-5">Threshold</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {inventoryData.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-5 font-bold text-sm">{item.name}</td>
                  <td className="px-8 py-5">
                    <code className="bg-muted px-2 py-1 rounded text-[10px] font-bold text-muted-foreground">
                      {item.sku}
                    </code>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold">{item.stock}</span>
                      <div className="flex flex-col gap-0.5">
                         <button className="p-0.5 hover:bg-muted rounded transition-colors"><ArrowUpRight className="w-3 h-3 text-emerald-600" /></button>
                         <button className="p-0.5 hover:bg-muted rounded transition-colors"><ArrowDownRight className="w-3 h-3 text-rose-600" /></button>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-muted-foreground">
                    Min: {item.minStock}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2">
                       {item.status === 'Critical' && <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />}
                       <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'Healthy' ? 'text-emerald-600' : 
                        item.status === 'Low Stock' ? 'text-orange-600' : 'text-rose-600'
                       )}>
                        {item.status}
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-primary text-xs font-bold hover:underline">Restock Plan</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
