import React from 'react';
import { motion } from 'framer-motion';

const ProductShowcase = ({ title, subtext, image, reverse = false }) => {
  return (
    <section className={`min-h-[80vh] w-full flex flex-col md:flex-row items-center justify-between px-gutter py-24 gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <motion.div 
        initial={{ opacity: 0, x: reverse ? 50 : -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
        className="flex-1 text-center md:text-left flex flex-col items-center md:items-start"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-elppa-obsidian leading-tight">
          {title}
        </h2>
        <p className="mt-4 text-lg text-elppa-gray max-w-[400px]">
          {subtext}
        </p>
        <button className="mt-8 text-elppa-blue font-medium hover:underline flex items-center gap-1 group">
          Xem thêm <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 w-full max-w-[600px]"
      >
        <img 
          src={image} 
          alt={title} 
          className="w-full h-auto drop-shadow-xl hover:scale-105 transition-transform duration-700 ease-elppa-ease"
        />
      </motion.div>
    </section>
  );
};

export default ProductShowcase;
