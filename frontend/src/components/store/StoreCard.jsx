import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const StoreCard = ({ product }) => {
  const navigate = useNavigate();

  // Lấy ảnh hiển thị: Ưu tiên ảnh của variant đầu tiên nếu có
  const mainImage = product.variants?.[0]?.images?.[0] || product.image || (product.images && product.images[0]);

  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="w-[320px] md:w-[400px] h-[480px] md:h-[550px] rounded-[30px] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 bg-white text-elppa-obsidian border border-elppa-gray-border/30 group mx-2"
    >
      {/* Header Info */}
      <div className="z-10 relative">
        <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 text-elppa-gray">
          {product.condition || 'MỚI'}
        </p>
        <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2 group-hover:text-elppa-blue transition-colors">
          {product.name}
        </h3>
        <p className="text-sm md:text-base font-medium text-elppa-gray line-clamp-2">
          {product.tagline || product.description || 'Tuyệt đỉnh công nghệ.'}
        </p>
      </div>

      {/* Product Image - Centered and constrained */}
      <div className="flex-1 flex items-center justify-center py-4">
        <img 
          src={mainImage} 
          alt={product.name} 
          className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Footer Info: Price and Colors */}
      <div className="z-10 flex items-end justify-between">
        <div className="flex flex-col">
           <p className="text-[10px] text-elppa-gray font-bold uppercase tracking-wider mb-1">Giá từ</p>
           <p className="text-lg md:text-xl font-bold">
             {product.price?.toLocaleString()}đ
           </p>
        </div>

        {/* Color Dots */}
        {product.variants && product.variants.length > 0 && (
          <div className="flex gap-1.5 mb-1.5">
            {product.variants.slice(0, 5).map((variant, idx) => (
              <div 
                key={idx}
                style={{ backgroundColor: variant.colorCode }}
                className="w-3 h-3 rounded-full border border-black/10 shadow-sm"
              />
            ))}
            {product.variants.length > 5 && (
              <span className="text-[10px] text-elppa-gray font-bold">+{product.variants.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StoreCard;
