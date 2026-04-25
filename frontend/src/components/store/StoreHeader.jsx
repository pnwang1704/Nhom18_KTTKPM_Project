import React from 'react';
import { motion } from 'framer-motion';

const StoreHeader = () => {
  return (
    <section className="bg-elppa-light pt-32 pb-16">
      <div className="max-w-[1240px] mx-auto px-gutter flex flex-col md:flex-row items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <h1 className="text-5xl md:text-8xl font-bold text-elppa-obsidian tracking-tight">
            Cửa Hàng
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 md:text-right"
        >
          <h2 className="text-xl md:text-2xl font-bold text-elppa-obsidian mb-2">
            Cách tốt nhất để mua<br />sản phẩm bạn thích.
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default StoreHeader;
