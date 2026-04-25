import React from 'react';
import { motion } from 'framer-motion';

const StoreCard = ({ product, spotlight = false }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`min-w-[320px] md:min-w-[400px] h-[450px] md:h-[500px] rounded-[30px] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ${
        spotlight ? 'bg-black text-white' : 'bg-white text-elppa-obsidian border border-elppa-gray-border/30'
      }`}
    >
      <div className="z-10">
        <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${spotlight ? 'text-blue-400' : 'text-elppa-gray'}`}>
          {product.condition || 'MỚI'}
        </p>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
          {product.name}
        </h3>
        <p className={`text-sm md:text-base font-medium ${spotlight ? 'text-white/80' : 'text-elppa-gray'}`}>
          {product.tagline || 'Tuyệt đỉnh công nghệ.'}
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center p-8 mt-12">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
        />
      </div>

      <div className="z-10 flex items-center justify-between mt-auto">
        <p className="font-semibold text-lg">
          Từ {product.price?.toLocaleString()}đ
        </p>
        {/* Color dots mockup */}
        <div className="flex gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className={`w-3 h-3 rounded-full border border-black/10 ${i === 1 ? 'bg-blue-400' : i === 2 ? 'bg-gray-400' : 'bg-pink-400'}`} />
           ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StoreCard;
