import React from 'react';
import { motion } from 'framer-motion';

const CategoryHero = ({ title, subtitle, image }) => {
  return (
    <section className="relative w-full h-[500px] md:h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 text-white">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability over light/busy images */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 text-center px-gutter">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.28, 0.11, 0.32, 1] }}
          className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6"
        >
          {title}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.28, 0.11, 0.32, 1] }}
          className="text-xl md:text-3xl text-white/90 font-medium max-w-[800px] mx-auto leading-tight"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  );
};

export default CategoryHero;
