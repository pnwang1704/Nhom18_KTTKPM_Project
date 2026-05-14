import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Smartphone,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Link } from 'react-router-dom';

const data = [
  { name: 'T1', revenue: 4000, orders: 240 },
  { name: 'T2', revenue: 3000, orders: 139 },
  { name: 'T3', revenue: 2000, orders: 980 },
  { name: 'T4', revenue: 2780, orders: 390 },
  { name: 'T5', revenue: 1890, orders: 480 },
  { name: 'T6', revenue: 2390, orders: 380 },
  { name: 'T7', revenue: 3490, orders: 430 },
];

const kpiCards = [
  { label: 'Tổng doanh thu', value: '128.430.000đ', trend: '+12.5%', isUp: true, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  { label: 'Đơn hàng hôm nay', value: '42', trend: '+18.2%', isUp: true, icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
  { label: 'Tổng khách hàng', value: '1.240', trend: '-2.4%', isUp: false, icon: Users, color: 'text-violet-600', bg: 'bg-violet-500/10' },
  { label: 'Tổng sản phẩm', value: '156', trend: '+4.1%', isUp: true, icon: Smartphone, color: 'text-orange-600', bg: 'bg-orange-500/10' },
  { label: 'Sắp hết hàng', value: '12', trend: 'Cấp bách', isUp: false, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-500/10' },
];

const Dashboard = () => {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan Bảng điều khiển</h1>
          <p className="text-muted-foreground mt-1">Chào mừng quay trở lại, Quản trị viên. Đây là tình hình hôm nay.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity w-fit">
          <ArrowUpRight className="w-4 h-4" />
          Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, i) => (
          <motion.div 
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card p-6 rounded-3xl border border-border hover:shadow-xl hover:shadow-primary/5 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} ${card.color} p-2.5 rounded-2xl`}>
                <card.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${card.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                {card.isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {card.trend}
              </div>
            </div>
            <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest">{card.label}</h3>
            <p className="text-2xl font-bold mt-1 tracking-tight">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Phân tích Doanh thu</h3>
            <select className="bg-muted/50 border-none rounded-lg px-3 py-1 text-sm outline-none font-medium">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>Năm nay</option>
            </select>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area name="Doanh thu" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card p-8 rounded-3xl border border-border"
        >
          <h3 className="text-xl font-bold mb-8">Thống kê Đơn hàng</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                  cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                />
                <Bar name="Đơn hàng" dataKey="orders" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border overflow-hidden"
        >
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-bold">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-primary text-sm font-bold hover:underline">Xem tất cả</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                  <th className="px-8 py-4">Mã đơn hàng</th>
                  <th className="px-8 py-4">Khách hàng</th>
                  <th className="px-8 py-4">Trạng thái</th>
                  <th className="px-8 py-4">Tổng tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { id: '#ORD-9281', customer: 'Phan Nhật Quang', status: 'Đã giao hàng', amount: '32.990.000đ', statusColor: 'text-emerald-600 bg-emerald-500/10' },
                  { id: '#ORD-9282', customer: 'Nguyễn Văn A', status: 'Đang xử lý', amount: '21.490.000đ', statusColor: 'text-orange-600 bg-orange-500/10' },
                  { id: '#ORD-9283', customer: 'Trần Thị B', status: 'Đang vận chuyển', amount: '45.150.000đ', statusColor: 'text-blue-600 bg-blue-500/10' },
                  { id: '#ORD-9284', customer: 'Lê Văn C', status: 'Đã giao hàng', amount: '15.750.000đ', statusColor: 'text-emerald-600 bg-emerald-500/10' },
                  { id: '#ORD-9285', customer: 'Phạm Minh D', status: 'Đã hủy', amount: '12.100.000đ', statusColor: 'text-rose-600 bg-rose-500/10' },
                ].map((order) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-8 py-4 font-bold text-sm">{order.id}</td>
                    <td className="px-8 py-4 text-sm font-medium">{order.customer}</td>
                    <td className="px-8 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.statusColor}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-sm font-bold tracking-tight">{order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-3xl border border-border overflow-hidden"
        >
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h3 className="text-xl font-bold">Sản phẩm bán chạy</h3>
            <Link to="/admin/products" className="text-primary text-sm font-bold hover:underline">Xem kho hàng</Link>
          </div>
          <div className="p-8 space-y-6">
            {[
              { name: 'iPhone 15 Pro Max', sales: 124, revenue: '34.990.000đ', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=100' },
              { name: 'Samsung Galaxy S24 Ultra', sales: 98, revenue: '29.990.000đ', image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=100' },
              { name: 'iPad Pro M2', sales: 76, revenue: '21.600.000đ', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=100' },
              { name: 'Apple Watch Series 9', sales: 65, revenue: '10.935.000đ', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=100' },
            ].map((product) => (
              <div key={product.name} className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-muted overflow-hidden border border-border group-hover:scale-105 transition-transform">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-elppa-obsidian">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{product.sales} lượt bán tháng này</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-elppa-obsidian">{product.revenue}</p>
                  <p className="text-[10px] text-emerald-600 font-bold mt-1">+8.2%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
