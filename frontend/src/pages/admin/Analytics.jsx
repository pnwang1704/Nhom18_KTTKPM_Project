import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const monthlySales = [
  { name: 'T1', revenue: 45000, orders: 320, profit: 12000 },
  { name: 'T2', revenue: 52000, orders: 380, profit: 15000 },
  { name: 'T3', revenue: 48000, orders: 350, profit: 13500 },
  { name: 'T4', revenue: 61000, orders: 420, profit: 18000 },
  { name: 'T5', revenue: 55000, orders: 390, profit: 16500 },
  { name: 'T6', revenue: 67000, orders: 480, profit: 21000 },
  { name: 'T7', revenue: 72000, orders: 510, profit: 23000 },
];

const categoryData = [
  { name: 'iPhone', value: 45, color: '#2563eb' },
  { name: 'Samsung', value: 25, color: '#10b981' },
  { name: 'iPad', value: 15, color: '#8b5cf6' },
  { name: 'Xiaomi', value: 10, color: '#f59e0b' },
  { name: 'Khác', value: 5, color: '#64748b' },
];

const Analytics = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân tích Kinh doanh</h1>
          <p className="text-muted-foreground mt-1">Phân tích chuyên sâu về hiệu suất và xu hướng bán hàng của cửa hàng.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-xl text-sm font-bold hover:bg-muted transition-all">
              <Calendar className="w-4 h-4" />
              Tùy chỉnh thời gian
           </button>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
              <Download className="w-4 h-4" />
              Tải báo cáo
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Giá trị đơn hàng TB', value: '24.500.000đ', trend: '+5.4%', isUp: true },
          { label: 'Tỷ lệ chuyển đổi', value: '3.24%', trend: '+0.8%', isUp: true },
          { label: 'Tỷ lệ giữ chân KH', value: '68.2%', trend: '-2.1%', isUp: false },
          { label: 'Biên lợi nhuận ròng', value: '24.5%', trend: '+1.2%', isUp: true },
        ].map((stat) => (
          <div key={stat.label} className="bg-card p-6 rounded-3xl border border-border">
             <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
             <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                <div className={cn(
                   "flex items-center gap-0.5 text-xs font-bold",
                   stat.isUp ? "text-emerald-600" : "text-rose-600"
                )}>
                   {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                   {stat.trend}
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card p-8 rounded-3xl border border-border">
           <h3 className="text-xl font-bold mb-8">Tăng trưởng Doanh thu & Lợi nhuận</h3>
           <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={monthlySales}>
                    <defs>
                       <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }}
                       itemStyle={{ color: 'hsl(var(--foreground))' }}
                    />
                    <Area name="Doanh thu" type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    <Area name="Lợi nhuận" type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-card p-8 rounded-3xl border border-border">
           <h3 className="text-xl font-bold mb-8">Doanh số theo Thương hiệu</h3>
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                       data={categoryData}
                       innerRadius={80}
                       outerRadius={100}
                       paddingAngle={5}
                       dataKey="value"
                    >
                       {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                       ))}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
           <div className="mt-8 space-y-3">
              {categoryData.map((item) => (
                 <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">{item.value}%</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
