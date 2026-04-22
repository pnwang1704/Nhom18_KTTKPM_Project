import React from 'react';
import { motion } from 'framer-motion';

const PromoBanner = ({ image }) => {
  return (
    <div className="w-full">
      {/* Announcement Bar */}
      <div className="bg-elppa-gray-subtle/50 py-3 text-center text-[13px] text-elppa-gray border-b border-elppa-gray-border/30">
        <p>Thành toán hàng tháng thật dễ dàng. Bao gồm lựa chọn lãi suất 0%. <button className="text-elppa-blue hover:underline">Tìm hiểu thêm ›</button></p>
      </div>

      {/* Main Promo Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden flex flex-col items-center justify-start pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt="Promotion Background" 
            className="w-full h-full object-cover object-bottom scale-105"
          />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-gutter">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-4xl md:text-7xl font-bold text-elppa-obsidian tracking-tight"
          >
            Môi Trường
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="mt-4 text-xl md:text-3xl text-elppa-obsidian font-medium max-w-[700px] mx-auto leading-tight"
          >
            Hành tinh của chúng ta xứng đáng với <br className="hidden md:block" /> những ý tưởng tốt nhất.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8 flex flex-col items-center"
          >
            <button className="bg-elppa-blue text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl">
              Tìm hiểu thêm
            </button>
            <div className="mt-16 flex items-center justify-center">
               <div className="flex flex-col items-center opacity-80">
                  <span className="text-8xl md:text-[12rem] font-bold text-elppa-obsidian select-none">2030</span>
                  <div className="flex items-center gap-2 -mt-4 md:-mt-8">
                    <span className="text-xl md:text-3xl font-bold tracking-[0.5em] text-elppa-obsidian ml-4 uppercase">ELPPA</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PromoBanner;
