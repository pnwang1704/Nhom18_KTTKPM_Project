import React from 'react';
import { motion } from 'framer-motion';

const CategoryNavbar = ({ currentTier, onTierChange }) => {
  const tiers = [
    { id: 'all', label: 'Tất cả' },
    { id: 'pro', label: 'Dòng Pro' },
    { id: 'standard', label: 'Tiêu chuẩn' }
  ];

  return (
    <nav className="sticky top-12 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-elppa-gray-border/30">
      <div className="max-w-[800px] mx-auto h-12 flex items-center justify-center gap-12 px-gutter">
        {tiers.map((tier) => (
          <button
            key={tier.id}
            onClick={() => onTierChange(tier.id)}
            className={`text-xs font-medium transition-all relative py-1 ${
              currentTier === tier.id ? 'text-elppa-obsidian' : 'text-elppa-gray hover:text-elppa-obsidian'
            }`}
          >
            {tier.label}
            {currentTier === tier.id && (
              <motion.div 
                layoutId="activeTier"
                className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-elppa-obsidian"
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavbar;
