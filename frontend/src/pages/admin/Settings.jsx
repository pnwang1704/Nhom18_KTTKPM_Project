import React from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  Image as ImageIcon,
  Truck,
  CreditCard,
  ShieldCheck,
  Bell,
  Globe,
  Save,
  Trash2,
  Upload
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const Settings = () => {
  return (
    <div className="max-w-[1000px] mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your store configuration and preferences.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-1">
          {[
            { icon: Store, label: 'Store Profile', active: true },
            { icon: ImageIcon, label: 'Visuals & Assets', active: false },
            { icon: Truck, label: 'Shipping', active: false },
            { icon: CreditCard, label: 'Payments', active: false },
            { icon: ShieldCheck, label: 'Security', active: false },
            { icon: Bell, label: 'Notifications', active: false },
            { icon: Globe, label: 'Localization', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left",
                item.active ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" : "text-muted-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {/* Store Info */}
          <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-4">Store Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Store Name</label>
                <input type="text" defaultValue="ELPPA Store" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Support Email</label>
                <input type="email" defaultValue="pnquangcn0406@gmail.com" className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Store Address</label>
                <textarea className="w-full bg-muted/50 border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium h-24 resize-none" defaultValue="Đại học Công nghiệp Thành phố Hồ Chí Minh" />
              </div>
            </div>
          </div>

          {/* Logo & Banners */}
          <div className="bg-card rounded-3xl border border-border p-8 space-y-6">
            <h3 className="text-lg font-bold border-b border-border pb-4">Branding & Visuals</h3>
            <div className="flex flex-col sm:flex-row gap-8">
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Store Logo</p>
                <div className="w-32 h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">E</div>
                  <span className="text-[10px] font-bold text-primary uppercase">Change Logo</span>
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Hero Banner</p>
                <div className="w-full h-32 rounded-3xl bg-muted border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/80 transition-colors relative overflow-hidden group">
                  <img src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform" />
                  <Upload className="w-6 h-6 text-primary z-10" />
                  <span className="text-xs font-bold text-primary uppercase z-10">Upload New Banner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-8 space-y-4">
            <h3 className="text-lg font-bold text-rose-600">Danger Zone</h3>
            <p className="text-sm text-rose-600/80 font-medium leading-relaxed">Once you delete your store data, there is no going back. Please be certain of your actions as they are permanent.</p>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
              <Trash2 className="w-4 h-4" />
              Maintenance Mode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
