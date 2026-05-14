import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import SupportHeader from '../components/support/SupportHeader';
import SupportQuickTools from '../components/support/SupportQuickTools';
import SupportPromoSection from '../components/support/SupportPromoSection';

const Support = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <main>
        <SupportHeader />

        <SupportQuickTools />

        {/* Device Selection Section */}
        <section className="bg-white py-16 border-t border-elppa-gray-border/30">
          <div className="max-w-[1200px] mx-auto px-gutter text-center">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {[
                { id: 'iphone', label: 'iPhone', image: '/assets/images/shelves/iphone.png' },
                { id: 'ipad', label: 'iPad', image: '/assets/images/shelves/ipad.png' },
                { id: 'samsung', label: 'Samsung', image: '/assets/images/shelves/Samsung-S25-Ultra-All-Colors-PNG.png' },
                { id: 'xiaomi', label: 'Xiaomi', image: '/assets/images/shelves/Xiaomi-17-Pro-PNG.png' },
                { id: 'oppo', label: 'Oppo', image: '/assets/images/shelves/Reno15-F-5G-AI2-removebg-preview.png' }
              ].map((item) => (
                <Link
                  key={item.id}
                  to={`/category/${item.id}`}
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-elppa-gray-subtle/50 rounded-2xl mb-2 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-full h-full object-contain p-2"
                    />
                  </div>
                  <span className="text-xs md:text-sm font-semibold text-elppa-gray group-hover:text-elppa-obsidian transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Promo Sections */}
        <SupportPromoSection
          title="Được xử lý thông qua ELPPACare"
          subtitle="ELPPACARE"
          description="Mọi gói ELPPACare đều cung cấp dịch vụ bảo dưỡng tập trung cho sản phẩm ELPPA, với dịch vụ sửa chữa nhanh chóng, dễ dàng cho các sự cố như đánh rơi và làm đổ chất lỏng."
          linkText="Tìm hiểu thêm"
          image="/assets/images/support/care.png"
        />

        <SupportPromoSection
          title="Sửa chữa và bảo dưỡng ELPPA"
          subtitle="CHẤT LƯỢNG CHÍNH HÃNG"
          description="Chúng tôi có thể giúp bạn tìm trường hợp sửa chữa được ELPPA chứng nhận, do các chuyên gia tin cậy thực hiện bằng linh kiện chính hãng của ELPPA."
          linkText="Bắt đầu sửa chữa"
          image="/assets/images/support/repair.png"
          reverse={true}
        />

        <SupportPromoSection
          title="Ứng dụng hỗ trợ của ELPPA"
          subtitle="ỨNG DỤNG"
          description="Yêu cầu trợ giúp cho tất cả các sản phẩm ELPPA của bạn ở một nơi hoặc kết nối với chuyên gia."
          linkText="Tải về"
          image="/assets/images/support/app.png"
        />

        {/* Warning Section */}
        <section className="bg-elppa-gray-subtle/50 py-24 px-gutter">
          <div className="max-w-[800px] mx-auto text-xs text-elppa-gray leading-loose text-center md:text-left">
            <h4 className="text-sm font-bold text-elppa-obsidian mb-4">Thận trọng với linh kiện giả</h4>
            <p className="mb-4">Một số bộ chuyển đổi điện và pin giả của bên thứ ba có thiết kế không đúng cách và có nguy cơ gây ra các sự cố về an toàn. Để đảm bảo nhận được pin chính hãng của ELPPA trong quá trình thay thế pin, bạn nên tìm đến Nhà cung cấp dịch vụ ủy quyền của ELPPA.</p>
            <p>Ngoài ra, màn hình thay thế không chính hãng có thể làm giảm chất lượng hình ảnh và hoạt động không đúng cách. Dịch vụ sửa chữa màn hình được ELPPA chứng nhận sẽ do các chuyên gia đáng tin cậy thực hiện hiện bằng linh kiện chính hãng của ELPPA.</p>
          </div>
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

export default Support;
