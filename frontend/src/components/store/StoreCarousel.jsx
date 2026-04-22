import React from 'react';
import { motion } from 'framer-motion';

const StoreCarousel = ({ title, subtitle, children }) => {
  return (
    <section className="bg-elppa-light py-12 md:py-20">
      <div className="max-w-[1200px] mx-auto px-gutter mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-elppa-obsidian">
          {title}. <span className="text-elppa-gray font-medium">{subtitle}</span>
        </h2>
      </div>

      <div className="w-full overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex gap-6 px-gutter md:px-[calc((100vw-1200px)/2+var(--gutter))] min-w-max pb-8 pt-4">
           {children}
        </div>
      </div>
    </section>
  );
};

export default StoreCarousel;
