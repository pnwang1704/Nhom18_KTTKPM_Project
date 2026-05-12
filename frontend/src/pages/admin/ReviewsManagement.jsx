import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Search, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  MessageSquare,
  Filter,
  ThumbsUp
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';

const reviews = [
  { id: 1, customer: 'Phan Nhật Quang', product: 'iPhone 15 Pro Max', rating: 5, content: 'Sản phẩm tuyệt vời, giao hàng nhanh chóng và đóng gói rất cẩn thận. Rất hài lòng!', date: '2024-05-10', status: 'Approved' },
  { id: 2, customer: 'Nguyễn Văn A', product: 'Samsung Galaxy S24 Ultra', rating: 4, content: 'Máy dùng tốt, tuy nhiên pin sạc hơi nóng một chút. Tổng quan vẫn rất ổn.', date: '2024-05-11', status: 'Pending' },
  { id: 3, customer: 'Trần Thị B', product: 'iPad Pro M2', rating: 5, content: 'Màn hình quá đẹp, làm việc thiết kế rất mượt mà. Đáng đồng tiền bát gạo.', date: '2024-05-09', status: 'Approved' },
  { id: 4, customer: 'Lê Văn C', product: 'iPhone 13', rating: 3, content: 'Giao hàng hơi chậm, sản phẩm thì ok không có vấn đề gì.', date: '2024-05-08', status: 'Pending' },
  { id: 5, customer: 'Phạm Minh D', product: 'Oppo Find X7 Ultra', rating: 2, content: 'Camera không như mong đợi, phần mềm thỉnh thoảng bị lag.', date: '2024-05-07', status: 'Hidden' },
];

const ReviewsManagement = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reviews</h1>
          <p className="text-muted-foreground mt-1">Moderate customer feedback and maintain product quality standards.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Average Rating</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                 <span className="text-2xl font-bold">4.8</span>
                 <div className="flex text-orange-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current opacity-50" />
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by product or customer..." 
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-border bg-card rounded-xl text-sm font-bold hover:bg-muted transition-all">
            <Filter className="w-4 h-4 text-muted-foreground" />
            Rating Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Customer & Product</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5 w-[40%]">Content</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-elppa-obsidian">{review.customer}</p>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{review.product}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn("w-3.5 h-3.5", i < review.rating ? "fill-current" : "text-muted opacity-30")} 
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold mt-2">{review.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-elppa-gray leading-relaxed italic">"{review.content}"</p>
                    <div className="flex items-center gap-4 mt-3">
                       <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                        review.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                        review.status === 'Pending' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                       )}>{review.status}</span>
                       <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                          <ThumbsUp className="w-3 h-3" /> 12
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Approve">
                          <CheckCircle2 className="w-5 h-5" />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" title="Hide">
                          <XCircle className="w-5 h-5" />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </div>
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

export default ReviewsManagement;
