import React from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Plus, 
  Search, 
  Calendar, 
  Ticket,
  Copy,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const promotions = [
  { id: 1, code: 'ELPPASUMMER24', discount: '15% Off', type: 'Coupon', status: 'Active', expiry: '2024-08-31', usage: '124/500' },
  { id: 2, code: 'NEWBIE100', discount: '$100 Off', type: 'Fixed', status: 'Active', expiry: '2024-12-31', usage: '850/Unlimited' },
  { id: 3, code: 'IPHONE16LAUNCH', discount: '5% Off', type: 'Category', status: 'Upcoming', expiry: '2024-09-15', usage: '0/1000' },
  { id: 4, code: 'FLASH20', discount: '20% Off', type: 'Coupon', status: 'Expired', expiry: '2024-05-01', usage: '500/500' },
];

const Promotions = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="text-muted-foreground mt-1">Create and manage discount codes and marketing campaigns.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" />
          New Promotion
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promotions.slice(0, 3).map((promo) => (
          <div key={promo.id} className="bg-card rounded-3xl border border-border p-6 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4">
                <Ticket className="w-12 h-12 text-primary/5 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
             </div>
             <div className={cn(
                "w-fit px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest mb-4",
                promo.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-muted text-muted-foreground'
             )}>
                {promo.status}
             </div>
             <h3 className="text-xl font-bold text-elppa-obsidian mb-1">{promo.discount}</h3>
             <div className="flex items-center gap-2 mb-6">
                <code className="bg-muted px-2 py-1 rounded text-xs font-bold text-primary">{promo.code}</code>
                <button className="text-muted-foreground hover:text-primary transition-colors"><Copy className="w-3 h-3" /></button>
             </div>
             <div className="space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-muted-foreground font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Expires</span>
                   <span className="font-bold">{promo.expiry}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-muted-foreground font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Usage</span>
                   <span className="font-bold">{promo.usage}</span>
                </div>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by code or type..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Coupon Details</th>
                <th className="px-8 py-5">Type</th>
                <th className="px-8 py-5">Value</th>
                <th className="px-8 py-5">Expiry</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {promotions.map((promo) => (
                <tr key={promo.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-elppa-obsidian">{promo.code}</p>
                    <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Campaign ID: #CAM-{promo.id}28</p>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-muted-foreground uppercase">{promo.type}</td>
                  <td className="px-8 py-5 text-sm font-bold text-primary">{promo.discount}</td>
                  <td className="px-8 py-5 text-xs font-medium">{promo.expiry}</td>
                  <td className="px-8 py-5">
                     <div className="flex items-center gap-2">
                        {promo.status === 'Active' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                        <span className={cn(
                           "text-[10px] font-bold uppercase tracking-widest",
                           promo.status === 'Active' ? 'text-emerald-600' : 'text-muted-foreground'
                        )}>{promo.status}</span>
                     </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                     <button className="text-primary text-xs font-bold hover:underline">Edit</button>
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

export default Promotions;
