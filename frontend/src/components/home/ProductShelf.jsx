import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductShelf = ({ brand, slogan, image, link = "/", dark = false, fullWidth = false }) => {
  if (fullWidth) {
    return (
      <section className="relative w-full h-[600px] md:h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={brand} 
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay for text readability if needed */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-gutter">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
            className="text-4xl md:text-7xl font-bold tracking-tight text-white"
          >
            {brand}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.28, 0.11, 0.32, 1] }}
            className="mt-4 text-xl md:text-2xl font-medium text-white/90"
          >
            {slogan}
          </motion.p>

          <div className="mt-10 flex gap-4 justify-center">
            <Link to={link}>
              <button className="bg-white text-black px-8 py-3 rounded-full text-base font-bold hover:bg-gray-200 transition-colors">
                Tìm hiểu thêm
              </button>
            </Link>
            <Link to={link}>
              <button className="px-8 py-3 rounded-full text-base font-bold border border-white text-white hover:bg-white hover:text-black transition-all">
                Mua ngay
              </button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`w-full py-20 flex flex-col items-center justify-start overflow-hidden ${dark ? 'bg-elppa-obsidian text-white' : 'bg-white text-elppa-obsidian'}`}>
      <div className="text-center px-gutter z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          {brand}
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.28, 0.11, 0.32, 1] }}
          className="mt-4 text-xl md:text-2xl font-medium"
        >
          {slogan}
        </motion.p>
 
        <div className="mt-8 flex gap-4 justify-center">
          <Link to={link}>
            <button className="bg-elppa-blue text-white px-6 py-2 rounded-full text-base font-medium hover:bg-blue-700 transition-colors">
              Tìm hiểu thêm
            </button>
          </Link>
          <Link to={link}>
            <button className={`px-6 py-2 rounded-full text-base font-medium border transition-all ${dark ? 'border-white text-white hover:bg-white hover:text-black' : 'border-elppa-blue text-elppa-blue hover:bg-elppa-blue hover:text-white'}`}>
              Mua ngay
            </button>
          </Link>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="mt-12 w-full max-w-[1024px] px-gutter h-[350px] md:h-[500px]"
      >
        <img 
          src={image} 
          alt={brand} 
          className="w-full h-full object-contain"
        />
      </motion.div>
    </section>
  );
};

export default ProductShelf;
