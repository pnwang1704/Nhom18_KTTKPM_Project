import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const features = [
  {
    id: 1,
    title: "Hệ thống Camera Siêu Việt",
    subtitle: "Nhiếp ảnh chuyên nghiệp",
    description: "Cụm 3 camera tiên tiến với khả năng chụp đêm siêu thực và độ phân giải cực cao.",
    image: "/assets/images/features/camera.png",
    accentColor: "text-blue-400"
  },
  {
    id: 2,
    title: "Đỉnh Cao Chế Tác",
    subtitle: "Mỏng đến kinh ngạc",
    description: "Khung viền titan siêu bền cùng độ mỏng ấn tượng, mang lại cảm giác cầm nắm hoàn hảo.",
    image: "/assets/images/features/profile.png",
    accentColor: "text-purple-400"
  },
  {
    id: 3,
    title: "Màn Hình Vô Cực OLED",
    subtitle: "Sắc nét từng pixel",
    description: "Trải nghiệm hình ảnh sống động với độ tương phản tuyệt đối và tần số quét 120Hz.",
    image: "/assets/images/features/display.png",
    accentColor: "text-orange-400"
  }
];

const TVCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <section className="bg-elppa-light py-20 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-gutter mb-10 flex items-end justify-between">
         <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl font-bold text-elppa-obsidian">Tính năng</span>
            <span className="text-3xl md:text-4xl font-light text-elppa-obsidian">nổi bật</span>
         </div>
         <button className="text-elppa-blue font-medium hover:underline">Khám phá tất cả tính năng ›</button>
      </div>

      <div className="relative h-[450px] md:h-[600px] w-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -100 }}
            transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
            className="absolute w-[90%] md:w-[80%] h-full rounded-[30px] overflow-hidden shadow-2xl bg-white"
          >
            <img 
              src={features[currentIndex].image} 
              alt={features[currentIndex].title} 
              className="w-full h-full object-contain md:object-cover"
            />
            
            {/* Content Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 md:p-16">
              <div className="flex flex-col items-start max-w-[600px]">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-sm font-bold tracking-widest uppercase ${features[currentIndex].accentColor}`}>ELPPA TECHNOLOGY</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
                  {features[currentIndex].title}
                </h3>
                <div className="flex items-center gap-4">
                  <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                    Tìm hiểu thêm
                  </button>
                  <p className="text-white/90 text-sm md:text-lg font-medium hidden sm:block">
                    {features[currentIndex].subtitle} • {features[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Control Bar */}
      <div className="max-w-[1024px] mx-auto mt-12 px-gutter flex items-center justify-center gap-8">
        <div className="flex gap-2">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-8 bg-elppa-obsidian' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-full border border-elppa-gray-border hover:bg-elppa-gray-subtle transition-colors"
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
      </div>
    </section>
  );
};

export default TVCarousel;
