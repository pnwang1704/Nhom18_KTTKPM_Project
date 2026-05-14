import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Search, 
  CheckCircle2, 
  XCircle, 
  MoreHorizontal,
  MessageSquare,
  Filter,
  ThumbsUp,
  Trash2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../utils/admin-utils';
import { apiRequest } from '../../services/api/client';

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await apiRequest('/api/products/reviews/all');
      const result = await res.json();
      if (result.success) {
        setReviews(result.data);
      }
    } catch (err) {
      console.error('Fetch reviews error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = (review) => {
    setReviewToDelete(review);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    
    setDeleting(true);
    try {
      const res = await apiRequest(`/api/products/${reviewToDelete.productId}/reviews/${reviewToDelete.reviewId}`, {
        method: 'DELETE'
      });
      const result = await res.json();
      if (result.success) {
        setIsDeleteModalOpen(false);
        setReviewToDelete(null);
        fetchReviews();
      }
    } catch (err) {
      console.error('Delete review error:', err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredReviews = reviews.filter(rev => 
    rev.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.comment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Đang tải danh sách đánh giá...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đánh giá</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và quản lý phản hồi từ khách hàng về sản phẩm.</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Đánh giá trung bình</p>
              <div className="flex items-center gap-2 mt-1 justify-end">
                 <span className="text-2xl font-bold">{averageRating}</span>
                 <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className={cn("w-4 h-4", s <= Math.round(averageRating) ? "fill-current" : "opacity-30")} />
                    ))}
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
              placeholder="Tìm theo sản phẩm, khách hàng..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-card border border-border rounded-xl w-full sm:w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-foreground"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-muted-foreground px-3 py-1 bg-muted rounded-full">
              Tổng {filteredReviews.length} bình luận
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                <th className="px-8 py-5">Khách hàng & Sản phẩm</th>
                <th className="px-8 py-5">Đánh giá</th>
                <th className="px-8 py-5 w-[40%]">Nội dung</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReviews.length > 0 ? filteredReviews.map((review, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={idx} 
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div>
                      <p className="text-sm font-bold text-elppa-obsidian">{review.userName}</p>
                      <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{review.productName}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={cn("w-3.5 h-3.5", s <= review.rating ? "fill-current" : "text-muted opacity-30")} 
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold mt-2">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm text-elppa-gray leading-relaxed">
                      "{review.comment}"
                    </p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button 
                         onClick={() => handleDeleteReview(review)}
                         disabled={deleting}
                         className="p-2 rounded-lg hover:bg-rose-50 text-rose-600 transition-colors" 
                         title="Xóa đánh giá"
                       >
                          <Trash2 className="w-5 h-5" />
                       </button>
                       <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                       </button>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-8 py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                       <MessageSquare className="w-12 h-12 opacity-20" />
                       <p className="font-medium">Không tìm thấy đánh giá nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-card w-full max-w-md rounded-[32px] shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-elppa-obsidian">Xác nhận xóa?</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Bạn có chắc chắn muốn xóa đánh giá của khách hàng <span className="font-bold text-elppa-obsidian">"{reviewToDelete?.userName}"</span>? 
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex items-center gap-4">
                <button 
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border rounded-2xl font-bold hover:bg-muted transition-all"
                >
                  Hủy
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-700 transition-all disabled:opacity-50"
                >
                  {deleting ? 'Đang xóa...' : 'Xóa ngay'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ReviewsManagement;
