import React from 'react';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

const MinimalProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.28, 0.11, 0.32, 1] }}
      onClick={() => navigate(`/product/${product._id}`)}
      className="bg-white rounded-[32px] p-6 md:p-8 border border-elppa-gray-border/30 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 h-full"
    >
      <div className="w-full h-[180px] md:h-[240px] mb-6 overflow-hidden flex items-center justify-center">
        <img 
          src={product.image || (product.images && product.images[0]) || (product.variants && product.variants[0]?.images[0])} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-elppa-ease"
        />
      </div>

      <div className="flex flex-col items-center flex-grow">
        <h3 className="text-xl md:text-2xl font-bold text-elppa-obsidian leading-tight">
          {product.name}
        </h3>
        <p className="mt-2 text-elppa-gray font-medium text-xs md:text-sm line-clamp-2">
          {product.tagline || "Trải nghiệm đỉnh cao công nghệ."}
        </p>
        <div className="mt-auto pt-4">
          <p className="text-elppa-obsidian font-bold text-base">
            Từ {(product.price || product.variants?.[0]?.options?.[0]?.price || 0).toLocaleString()}đ
          </p>
          <button className="mt-4 bg-elppa-blue text-white px-5 py-1.5 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            Mua ngay
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MinimalProductCard;
