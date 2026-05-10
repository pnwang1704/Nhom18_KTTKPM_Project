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
      className="bg-white rounded-[32px] p-8 md:p-12 border border-elppa-gray-border/30 flex flex-col items-center text-center group cursor-pointer hover:shadow-2xl hover:shadow-black/5 transition-all duration-500"
    >
      <div className="w-full h-[300px] md:h-[450px] mb-8 overflow-hidden">
        <img 
          src={product.image || (product.images && product.images[0])} 
          alt={product.name} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-elppa-ease"
        />
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-2xl md:text-3xl font-bold text-elppa-obsidian">
          {product.name}
        </h3>
        <p className="mt-2 text-elppa-gray font-medium text-sm md:text-base">
          {product.tagline || "Trải nghiệm đỉnh cao công nghệ."}
        </p>
        <p className="mt-4 text-elppa-obsidian font-semibold text-lg">
          Từ {product.price?.toLocaleString()}đ
        </p>
        <button className="mt-6 bg-elppa-blue text-white px-6 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          Mua ngay
        </button>
      </div>
    </motion.div>
  );
};

export default MinimalProductCard;
