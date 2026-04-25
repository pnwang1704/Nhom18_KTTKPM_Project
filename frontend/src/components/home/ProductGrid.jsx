import React from 'react';
import { motion } from 'framer-motion';

const ProductGrid = ({ products = [] }) => {
  return (
    <section className="py-24 bg-elppa-gray-subtle/30 px-gutter">
      <div className="max-w-[1024px] mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold mb-12 text-elppa-obsidian">Khám phá bộ sưu tập.</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[30px] border border-elppa-gray-border/50 hover:shadow-xl transition-all duration-500 ease-elppa-ease group cursor-pointer"
            >
              <div className="h-64 flex items-center justify-center mb-6">
                <img 
                   src={product.image || "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&q=80&w=800"} 
                   alt={product.name} 
                   className="max-h-full max-w-full drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-widest text-orange-600 font-bold mb-2 block">Mới nội bật</span>
                <h4 className="text-lg font-bold text-elppa-obsidian">{product.name || 'Smartphone Model'}</h4>
                <p className="text-sm text-elppa-gray mt-1">Từ ${product.price || '999'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
