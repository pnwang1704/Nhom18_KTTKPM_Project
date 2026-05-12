import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import StoreHeader from '../components/store/StoreHeader';
import StoreCategoryNav from '../components/store/StoreCategoryNav';
import StoreCarousel from '../components/store/StoreCarousel';
import StoreCard from '../components/store/StoreCard';
import { apiRequest } from '../services/api/client';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiRequest('/api/products?limit=100');
        const result = await response.json();
        if (result.success) {
          setProducts(result.products || []);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  const filterByBrand = (brand) => {
    return products.filter(p => p.name.toLowerCase().includes(brand.toLowerCase()));
  };

  return (
    <div className="bg-elppa-light min-h-screen">
      <Navbar />
      
      <main>
        <StoreHeader />
        <StoreCategoryNav />

        {loading ? (
          <div className="h-96 flex items-center justify-center">
             <div className="w-8 h-8 border-4 border-elppa-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* iPhone Section */}
            <StoreCarousel title="iPhone" subtitle="Thế hệ mới nhất. Xem ngay có gì mới.">
              {filterByBrand('iphone').map((p, i) => (
                <StoreCard key={p._id} product={p} spotlight={p.name.toLowerCase().includes('pro')} />
              ))}
            </StoreCarousel>

            {/* iPad Section */}
            <StoreCarousel title="iPad" subtitle="Khơi nguồn sáng tạo. Đỉnh cao hiệu suất.">
              {filterByBrand('ipad').map((p, i) => (
                <StoreCard key={p._id} product={p} />
              ))}
            </StoreCarousel>

            {/* Samsung Section */}
            <StoreCarousel title="Samsung" subtitle="Trải nghiệm AI đỉnh cao trên di động.">
              {filterByBrand('samsung').map((p, i) => (
                <StoreCard key={p._id} product={p} spotlight={p.name.toLowerCase().includes('ultra')} />
              ))}
            </StoreCarousel>

            {/* Xiaomi Section */}
            <StoreCarousel title="Xiaomi" subtitle="Đẳng cấp nhiếp ảnh chuyên nghiệp.">
              {filterByBrand('xiaomi').map((p, i) => (
                <StoreCard key={p._id} product={p} />
              ))}
            </StoreCarousel>

            {/* Oppo Section */}
            <StoreCarousel title="Oppo" subtitle="Vẻ đẹp tinh tế. Sạc siêu nhanh.">
              {filterByBrand('oppo').map((p, i) => (
                <StoreCard key={p._id} product={p} />
              ))}
            </StoreCarousel>
          </>
        )}
      </main>

      <footer className="py-20 px-gutter border-t border-elppa-gray-border/30 bg-elppa-light">
        <div className="max-w-[1024px] mx-auto text-xs text-elppa-gray leading-loose text-center">
          <p>© 2024 Cửa hàng tối giản ELPPA. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
};

export default Store;
