import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ image, link = "/store" }) => {
  return (
    <section className="min-h-screen bg-elppa-light flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="text-center px-gutter z-10">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-elppa-obsidian leading-[1.05]"
        >
          Mạnh mẽ. <br />
          Tối giản.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.28, 0.11, 0.32, 1] }}
          className="mt-6 text-lg md:text-2xl text-elppa-gray max-w-[600px] mx-auto font-medium"
        >
          Trải nghiệm công nghệ thuần khiết trong từng đường nét.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex gap-4 justify-center"
        >
          <Link to={link}>
            <button className="bg-elppa-blue text-white px-6 py-2.5 rounded-full text-base font-medium hover:bg-blue-700 transition-colors">
              Mua ngay
            </button>
          </Link>
          <Link to={link}>
            <button className="text-elppa-blue hover:underline text-base font-medium transition-all group flex items-center gap-1">
              Tìm hiểu thêm <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
        className="mt-12 w-full max-w-[800px] px-gutter"
      >
        <img 
          src={image} 
          alt="Hero Smartphone" 
          className="w-full h-auto drop-shadow-2xl"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
