import React from 'react';
import { motion } from 'framer-motion';

const tools = [
  { id: 1, title: 'Đặt lại mật khẩu Tài khoản ELPPA', link: '#' },
  { id: 2, title: 'Kiểm tra chương trình bảo hành hoặc gói ELPPACare', link: '#' },
  { id: 3, title: 'Thay đổi gói đăng ký', link: '#' }
];

const SupportQuickTools = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-[1200px] mx-auto px-gutter">
        <h2 className="text-2xl md:text-3xl font-bold text-elppa-obsidian mb-8 text-center md:text-left">Công cụ hỗ trợ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-elppa-gray-subtle/50 p-8 rounded-2xl border border-elppa-gray-border/30 text-left hover:bg-white hover:shadow-xl transition-all h-full"
            >
              <p className="text-elppa-blue font-medium text-sm md:text-base leading-snug">
                {tool.title}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportQuickTools;
