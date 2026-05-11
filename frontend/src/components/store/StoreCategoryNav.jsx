import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { id: 'iphone', label: 'iPhone', image: '/assets/images/shelves/iphone.png' },
  { id: 'ipad', label: 'iPad', image: '/assets/images/shelves/ipad.png' },
  { id: 'samsung', label: 'Samsung', image: '/assets/images/shelves/Samsung-S25-Ultra-All-Colors-PNG.png' },
  { id: 'xiaomi', label: 'Xiaomi', image: '/assets/images/shelves/Xiaomi-17-Pro-PNG.png' },
  { id: 'oppo', label: 'Oppo', image: '/assets/images/shelves/Reno15-F-5G-AI2-removebg-preview.png' }
];

const StoreCategoryNav = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-elppa-light py-8 mb-12">
      <div className="max-w-[1200px] mx-auto px-gutter overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between md:justify-center gap-12 md:gap-20 min-w-max pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="flex flex-col items-center gap-4 group transition-all"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs md:text-sm font-semibold text-elppa-obsidian">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoreCategoryNav;
