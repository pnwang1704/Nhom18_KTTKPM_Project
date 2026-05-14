import React from 'react';
import { motion } from 'framer-motion';

const SupportPromoSection = ({ title, subtitle, description, linkText, image, reverse = false, bgColor = "bg-white" }) => {
  return (
    <section className={`py-12 md:py-16 ${bgColor}`}>
      <div className="max-w-[1200px] mx-auto px-gutter">
        <div className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 bg-white rounded-3xl border border-elppa-gray-border/30 overflow-hidden shadow-sm`}>
          <div className="flex-1 w-full h-[300px] md:h-[450px] bg-elppa-gray-subtle/30 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>

          <div className="flex-1 p-8 md:p-16">
            <p className="text-elppa-gray font-bold text-xs uppercase tracking-widest mb-2">{subtitle}</p>
            <h3 className="text-3xl md:text-5xl font-bold text-elppa-obsidian mb-6 leading-tight">
              {title}
            </h3>
            <p className="text-elppa-gray text-lg mb-8 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportPromoSection;
