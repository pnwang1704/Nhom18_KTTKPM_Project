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
  const [priceRange, setPriceRange] = useState('all'); // all, under-15, 15-25, over-25
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const data = categoryData[brand.toLowerCase()] || categoryData.iphone;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiRequest('/api/products?limit=100');
        const result = await response.json();
        if (result.success) {
          // Filter by brand
          const productsList = result.products || [];
          let filtered = productsList.filter(p => 
            p.name.toLowerCase().includes(brand.toLowerCase()) || 
            (p.category && p.category.toLowerCase().includes(brand.toLowerCase()))
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

  // Combined filtering logic
  const filteredProducts = products.filter(p => {
    // 1. Tier filtering
    let matchTier = true;
    if (currentTier === 'pro') matchTier = p.name.toLowerCase().includes('pro');
    else if (currentTier === 'standard') matchTier = !p.name.toLowerCase().includes('pro');

    if (!matchTier) return false;

    // 2. Price filtering
    if (priceRange === 'all') return true;
    if (priceRange === 'under-15') return p.price < 15000000;
    if (priceRange === '15-25') return p.price >= 15000000 && p.price <= 25000000;
    if (priceRange === 'over-25') return p.price > 25000000;

    return true;
  });

  const priceFilters = [
    { id: 'all', label: 'Tất cả giá' },
    { id: 'under-15', label: 'Dưới 15tr' },
    { id: '15-25', label: '15tr - 25tr' },
    { id: 'over-25', label: 'Trên 25tr' }
  ];

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
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-elppa-obsidian mb-4">Khám phá dòng sản phẩm.</h2>
              <p className="text-elppa-gray text-lg">Tìm chiếc {data.title} hoàn hảo cho riêng bạn.</p>
            </div>
            
            {/* Price Filter UI */}
            <div className="flex flex-wrap gap-2">
              {priceFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setPriceRange(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    priceRange === filter.id 
                    ? 'bg-elppa-obsidian text-white' 
                    : 'bg-elppa-light text-elppa-gray hover:bg-elppa-gray-border/20'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
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
