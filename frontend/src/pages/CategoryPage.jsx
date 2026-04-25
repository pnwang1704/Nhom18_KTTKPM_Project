import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import CategoryNavbar from '../components/category/CategoryNavbar';
import CategoryHero from '../components/category/CategoryHero';
import MinimalProductCard from '../components/category/MinimalProductCard';
import { apiRequest } from '../services/api/client';

const categoryData = {
  iphone: {
    title: "iPhone",
    subtitle: "Gặp gỡ thế hệ iPhone mới nhất.",
    heroImage: "/assets/images/category/iphone-hero.png"
  },
  ipad: {
    title: "iPad",
    subtitle: "Khơi nguồn sáng tạo, nâng tầm hiệu suất.",
    heroImage: "/assets/images/shelves/ipad.png"
  },
  samsung: {
    title: "Samsung Galaxy",
    subtitle: "Trải nghiệm AI đỉnh cao trên di động.",
    heroImage: "/assets/images/shelves/galaxy-s26-ultra-features-kv.jpg"
  },
  xiaomi: {
    title: "Xiaomi",
    subtitle: "Định nghĩa lại nhiếp ảnh di động chuyên nghiệp.",
    heroImage: "/assets/images/shelves/redmi.webp"
  },
  oppo: {
    title: "Oppo",
    subtitle: "Sáng tạo và tinh tế trong từng đường nét.",
    heroImage: "/assets/images/shelves/oppoo.jpg"
  }
};

const CategoryPage = () => {
  const { brand } = useParams();
  const [currentTier, setCurrentTier] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const data = categoryData[brand.toLowerCase()] || categoryData.iphone;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiRequest('/api/products');
        const result = await response.json();
        if (result.success) {
          // Filter by brand
          const productsList = result.products || [];
          let filtered = productsList.filter(p => 
            p.name.toLowerCase().includes(brand.toLowerCase()) || 
            (p.category && p.name.toLowerCase().includes(brand.toLowerCase()))
          );
          
          setProducts(filtered);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, [brand]);

  // Tier filtering logic (Mock for now, can be extended with real data)
  const filteredProducts = products.filter(p => {
    if (currentTier === 'all') return true;
    if (currentTier === 'pro') return p.name.toLowerCase().includes('pro');
    if (currentTier === 'standard') return !p.name.toLowerCase().includes('pro');
    return true;
  });

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <CategoryNavbar currentTier={currentTier} onTierChange={setCurrentTier} />

      <main>
        <CategoryHero 
          title={data.title}
          subtitle={data.subtitle}
          image={data.heroImage}
        />

        <section className="py-24 px-gutter max-w-[1200px] mx-auto">
          <div className="mb-12">
             <h2 className="text-3xl md:text-5xl font-bold text-elppa-obsidian mb-4">Khám phá dòng sản phẩm.</h2>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
               <div className="w-8 h-8 border-4 border-elppa-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <MinimalProductCard key={product._id} product={product} index={index} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-elppa-gray">
                   Không tìm thấy sản phẩm nào trong danh mục này.
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      <footer className="py-20 px-gutter border-t border-elppa-gray-border/30 bg-elppa-light">
        <div className="max-w-[1024px] mx-auto text-xs text-elppa-gray leading-loose text-center">
          <p>© 2024 Cửa hàng tối giản ELPPA. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;
