import React from 'react';
import { motion } from 'framer-motion';
import PricingCard from '../../components/employer/PricingCard'; // "Import" (Import) "File 1/3" (File 1/3) "ta" (we) "vừa" (just) "làm" (built)

// --- DỮ LIỆU "GIẢ" (MOCK DATA) "CHO" (FOR) "CÁC" (THE) "GÓI" (PLANS) ---
const freePlanFeatures = [
  "Đăng 1 Job / tháng",
  "Quản lý Ứng viên (Kanban)",
  "Trang Công ty (Cơ bản)",
  "Hỗ trợ Email",
];

const proPlanFeatures = [
  "Đăng 10 Jobs / tháng",
  "Job được Đề xuất (Lên top)",
  "Tìm kiếm Ứng viên (Full)",
  "Đề xuất Ứng viên (AI)",
  "Tin nhắn Mẫu (Canned Messages)",
  "Hỗ trợ Ưu tiên (24/7)",
];

const enterprisePlanFeatures = [
  "Không giới hạn Jobs",
  "Tất cả tính năng Gói Pro",
  "Tích hợp ATS (API)",
  "Quản lý Tài khoản riêng",
  "Báo cáo & Phân tích (Analytics)",
  "Hỗ trợ 24/7 (Dedicated)",
];
// ------------------------------------

const EmployerVipPage = () => {
  return (
    <div className="space-y-8">
      
      {/* 1. "Hero Section" (Màn chào "chốt sale") */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Nâng Tầm Tuyển Dụng Của Bạn</h1>
        <p className="text-lg text-gray-600 mt-2">
          Chọn gói phù hợp để tiếp cận hàng ngàn ứng viên tiềm năng nhanh nhất.
        </p>
      </motion.div>

      {/* 2. "Bảng" (Grid) "So Sánh" (Comparison) "3" (Three) "Cột" (Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        
        {/* Gói 1: Thường (Free) */}
        <PricingCard
          planName="Thường (Free)"
          price="0 VNĐ"
          description="Khởi đầu cơ bản cho các công ty nhỏ."
          features={freePlanFeatures}
          isFeatured={false} // "Không" (Not) "nổi bật" (featured)
        />
        
        {/* Gói 2: Pro (VIP) - "Nổi bật" (Featured) "lên" (up) "ở" (in) "giữa" (middle) */}
        <PricingCard
          planName="Pro (VIP)"
          price="2.000.000 VNĐ"
          description="Giải pháp tốt nhất để tìm kiếm nhân tài."
          features={proPlanFeatures}
          isFeatured={true} // <-- "NỔI BẬT" (FEATURED) "NÈ" (LOOK)!
        />
        
        {/* Gói 3: Doanh nghiệp (Enterprise) */}
        <PricingCard
          planName="Doanh nghiệp"
          price="Liên hệ"
          description="Giải pháp toàn diện cho các tập đoàn lớn."
          features={enterprisePlanFeatures}
          isFeatured={false} // "Không" (Not) "nổi bật" (featured)
        />
        
      </div>
    </div>
  );
};

export default EmployerVipPage;