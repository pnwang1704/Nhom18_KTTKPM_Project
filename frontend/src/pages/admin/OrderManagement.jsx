import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar,
  CreditCard,
  Truck
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const mockOrders = [
  { id: '#ORD-9281', customer: 'Phan Nhật Quang', email: 'quang@example.com', products: 2, total: 32990000, status: 'Delivered', payment: 'Paid', date: '2024-05-10', method: 'Credit Card' },
  { id: '#ORD-9282', customer: 'Nguyễn Văn A', email: 'vana@example.com', products: 1, total: 21490000, status: 'Pending', payment: 'Unpaid', date: '2024-05-11', method: 'Bank Transfer' },
  { id: '#ORD-9283', customer: 'Trần Thị B', email: 'thib@example.com', products: 3, total: 45150000, status: 'Shipping', payment: 'Paid', date: '2024-05-11', method: 'E-Wallet' },
  { id: '#ORD-9284', customer: 'Lê Văn C', email: 'vanc@example.com', products: 1, total: 15750000, status: 'Delivered', payment: 'Paid', date: '2024-05-09', method: 'Credit Card' },
  { id: '#ORD-9285', customer: 'Phạm Minh D', email: 'minhd@example.com', products: 2, total: 12100000, status: 'Cancelled', payment: 'Refunded', date: '2024-05-08', method: 'Bank Transfer' },
  { id: '#ORD-9286', customer: 'Hoàng Thị E', email: 'thie@example.com', products: 1, total: 10990000, status: 'Pending', payment: 'Unpaid', date: '2024-05-12', method: 'COD' },
];

const statusStyles = {
  Delivered: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
  Pending: 'text-orange-600 bg-orange-500/10 border-orange-500/20',
  Shipping: 'text-blue-600 bg-blue-500/10 border-blue-500/20',
  Cancelled: 'text-rose-600 bg-rose-500/10 border-rose-500/20',
};

const OrderManagement = () => {
  const [filter, setFilter] = useState('Tất cả');

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đơn hàng</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và quản lý các đơn hàng và quá trình thực hiện của khách hàng.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Download className="w-4 h-4" />
            Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* Tabs / Quick Filters */}
      <div className="flex items-center gap-2 border-b border-border pb-px overflow-x-auto no-scrollbar">
        {['Tất cả', 'Chờ xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={cn(
              "px-4 py-3 text-sm font-bold transition-all relative min-w-max",
              filter === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
            {filter === tab && (
              <motion.div layoutId="order-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Tìm theo Mã đơn hoặc tên khách hàng..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold hover:bg-muted transition-all">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Khoảng thời gian
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Mã đơn</th>
                <th className="px-8 py-5">Khách hàng</th>
                <th className="px-8 py-5">Sản phẩm</th>
                <th className="px-8 py-5">Tổng tiền</th>
                <th className="px-8 py-5">Thanh toán</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockOrders.map((order) => (
                <motion.tr 
                  layout
                  key={order.id} 
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-8 py-5 font-bold text-sm">{order.id}</td>
                  <td className="px-8 py-5">
                    <div>
                      <p className="text-sm font-bold text-elppa-obsidian">{order.customer}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-muted-foreground">{order.products} món</td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold tracking-tight">{order.total.toLocaleString()}đ</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
                      <CreditCard className="w-3 h-3" />
                      {order.method === 'Credit Card' ? 'Thẻ tín dụng' : order.method === 'Bank Transfer' ? 'Chuyển khoản' : order.method === 'E-Wallet' ? 'Ví điện tử' : 'COD'}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", order.payment === 'Paid' ? 'bg-emerald-500' : 'bg-orange-500')} />
                      <span className="text-xs font-bold">{order.payment === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      order.status === 'Delivered' ? statusStyles.Delivered : order.status === 'Pending' ? statusStyles.Pending : order.status === 'Shipping' ? statusStyles.Shipping : statusStyles.Cancelled
                    )}>
                      {order.status === 'Delivered' ? 'Đã giao' : order.status === 'Pending' ? 'Chờ xử lý' : order.status === 'Shipping' ? 'Đang giao' : 'Đã hủy'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-[10px] font-bold uppercase hover:bg-primary hover:text-primary-foreground transition-all">
                        <Eye className="w-3 h-3" />
                        Chi tiết
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/10">
          <p className="text-sm text-muted-foreground font-medium italic">
            * Tất cả thời gian đơn hàng được tính theo giờ UTC+7
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
