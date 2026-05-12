import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar,
  ShoppingBag,
  Filter,
  Download,
  UserPlus
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const mockCustomers = [
  { id: 1, name: 'Phan Nhật Quang', email: 'quang@example.com', phone: '0917xxxxxx', orders: 12, spent: '$15,430', status: 'Active', avatar: 'PQ' },
  { id: 2, name: 'Nguyễn Văn A', email: 'vana@example.com', phone: '0988xxxxxx', orders: 5, spent: '$4,200', status: 'Active', avatar: 'VA' },
  { id: 3, name: 'Trần Thị B', email: 'thib@example.com', phone: '0901xxxxxx', orders: 2, spent: '$1,850', status: 'Inactive', avatar: 'TB' },
  { id: 4, name: 'Lê Văn C', email: 'vanc@example.com', phone: '0977xxxxxx', orders: 24, spent: '$32,100', status: 'Active', avatar: 'VC' },
  { id: 5, name: 'Phạm Minh D', email: 'minhd@example.com', phone: '0944xxxxxx', orders: 0, spent: '$0', status: 'New', avatar: 'MD' },
];

const CustomerManagement = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">Manage your customer relationships and view their purchase history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <UserPlus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Customers', value: '1,240', trend: '+12%', icon: Users },
          { label: 'Active Customers', value: '856', trend: '+5.2%', icon: UserCheck },
          { label: 'New This Month', value: '142', trend: '+24%', icon: UserPlus },
        ].map((stat, i) => (
          <div key={stat.label} className="bg-card p-6 rounded-3xl border border-border">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between mt-2">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search customers..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold hover:bg-muted transition-all">
              <Filter className="w-4 h-4 text-muted-foreground" />
              Advanced Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Orders</th>
                <th className="px-8 py-5">Total Spent</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {customer.avatar}
                      </div>
                      <p className="text-sm font-bold text-elppa-obsidian">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-elppa-obsidian">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                      {customer.orders}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold tracking-tight text-primary">
                    {customer.spent}
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      customer.status === 'Active' ? 'text-emerald-600 bg-emerald-50' : 
                      customer.status === 'Inactive' ? 'text-rose-600 bg-rose-50' : 'text-blue-600 bg-blue-50'
                    )}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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

// Supporting icons not imported above
const Users = ({ className }) => <ShoppingBag className={className} />; // Mock
const UserCheck = ({ className }) => <ShoppingBag className={className} />; // Mock

export default CustomerManagement;
