import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StoreCarousel = ({ title, subtitle, children }) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initially
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-elppa-light py-12 md:py-20 group/carousel relative">
      <div className="max-w-[1200px] mx-auto px-gutter mb-8">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          <span className="text-elppa-obsidian">{title}.</span>
          <span className="text-elppa-gray font-medium"> {subtitle}</span>
        </h2>
      </div>

      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 z-10 transition-opacity duration-300">
          {showLeftArrow && (
            <button 
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-black/5 flex items-center justify-center text-elppa-obsidian hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4 z-10 transition-opacity duration-300">
          {showRightArrow && (
            <button 
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-black/5 flex items-center justify-center text-elppa-obsidian hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div className="flex gap-6 px-gutter md:px-[calc((100vw-1200px)/2+var(--spacing-gutter))] min-w-max pb-8 pt-4">
             {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreCarousel;
