import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PromoBanner from '../components/home/PromoBanner';
import HeroSection from '../components/home/HeroSection';
import ProductShelf from '../components/home/ProductShelf';
import TVCarousel from '../components/home/TVCarousel';
import ProductGrid from '../components/home/ProductGrid';
import { apiRequest } from '../services/api/client';

// Asset paths
const PROMO_BG = '/assets/images/promo-bg.png';
const HERO_IMAGE = '/assets/images/hero.png';
const IPHONE_POSTER = '/assets/images/shelves/ip17.jpg';
const IPAD_POSTER = '/assets/images/shelves/ipadd.jpg';
const SAMSUNG_POSTER = '/assets/images/shelves/galaxy-s26-ultra-features-kv.jpg';
const XIAOMI_POSTER = '/assets/images/shelves/redmi.webp';
const OPPO_POSTER = '/assets/images/shelves/oppoo.jpg';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest('/api/products?limit=100');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-elppa-light overflow-x-hidden">
      <Navbar />

      <main>
        {/* New Promo Banner & Announcement */}
        <PromoBanner image={PROMO_BG} />

        {/* Brand Shelf: iPhone */}
        <ProductShelf 
          brand="ELPPA iPhone"
          slogan="Gặp gỡ thế hệ iPhone mới nhất."
          image={IPHONE_POSTER}
          fullWidth={true}
          link="/category/iphone"
        />

        {/* Brand Shelf: iPad */}
        <ProductShelf 
          brand="ELPPA iPad"
          slogan="Khơi nguồn sáng tạo, nâng tầm hiệu suất."
          image={IPAD_POSTER}
          fullWidth={true}
          link="/category/ipad"
        />

        {/* Brand Shelf: Samsung */}
        <ProductShelf 
          brand="Samsung Galaxy"
          slogan="Trải nghiệm công nghệ đỉnh cao từ tương lai."
          image={SAMSUNG_POSTER}
          fullWidth={true}
          link="/category/samsung"
        />

        {/* Brand Shelf: Xiaomi */}
        <ProductShelf 
          brand="Xiaomi"
          slogan="Đẳng cấp nhiếp ảnh chuyên nghiệp."
          image={XIAOMI_POSTER}
          fullWidth={true}
          link="/category/xiaomi"
        />

        {/* Brand Shelf: Oppo */}
        <ProductShelf 
          brand="Oppo"
          slogan="Vẻ đẹp tinh tế, sạc siêu nhanh."
          image={OPPO_POSTER}
          fullWidth={true}
          link="/category/oppo"
        />

        {/* HeroSection (As a featured highlight) */}
        <HeroSection image={HERO_IMAGE} />

        {/* ELPPA TV+ Carousel (Product features) */}
        <TVCarousel />

        {/* Secondary: Explorer Grid */}
        <ProductGrid products={products} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;