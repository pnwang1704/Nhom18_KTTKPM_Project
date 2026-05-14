import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const SupportHeader = () => {
  return (
    <section className="bg-white pt-32 pb-16 flex flex-col items-center">

      <div className="text-center px-gutter max-w-[800px] mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold text-elppa-obsidian mb-4"
        >
          Hỗ trợ của ELPPA
        </motion.h1>
        <p className="text-xl text-elppa-gray mb-12">Bạn cần trợ giúp? Bắt đầu tại đây.</p>

        <div className="relative w-full max-w-[600px] mx-auto mb-16">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-elppa-gray" size={20} />
          <input 
            type="text" 
            placeholder="Tìm kiếm chủ đề hỗ trợ" 
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-elppa-gray-subtle/50 border border-elppa-gray-border focus:border-elppa-blue focus:bg-white outline-none transition-all text-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default SupportHeader;
