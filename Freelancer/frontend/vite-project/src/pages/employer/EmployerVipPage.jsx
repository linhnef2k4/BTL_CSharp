import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import PricingCard from '../../components/employer/PricingCard'; 
import PaymentModal from '../../components/vip/PaymentModal'; // Tái sử dụng PaymentModal xịn
import { useAuth } from '../../context/AuthContext';

const freePlanFeatures = [
  "Đăng 5 Job / tháng",
  "Quản lý Ứng viên cơ bản",
  "Trang Công ty tiêu chuẩn",
  "Hỗ trợ qua Email (Chậm)",
];

const proPlanFeatures = [
  "Không giới hạn số lượng Job",
  "Huy hiệu VIP nổi bật",
  "Job được ghim lên đầu trang",
  "Xem đầy đủ liên hệ ứng viên",
  "Hỗ trợ ưu tiên 24/7",
  "Tìm kiếm ứng viên nâng cao",
];

const enterprisePlanFeatures = [
  "Tất cả tính năng Gói Pro",
  "API tích hợp hệ thống riêng",
  "Quản lý đa tài khoản (Team)",
  "Báo cáo phân tích chuyên sâu",
  "Chuyên viên hỗ trợ riêng",
  "Tùy chỉnh thương hiệu tuyển dụng",
];

const EmployerVipPage = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lấy thông tin VIP từ context
  const isVip = user?.employer?.isVip;
  const vipExpireDate = user?.employer?.vipExpireDate;

  const formattedExpireDate = vipExpireDate 
    ? new Date(vipExpireDate).toLocaleDateString('vi-VN', { 
        day: '2-digit', month: '2-digit', year: 'numeric' 
      })
    : null;

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">Nâng Tầm Tuyển Dụng Của Bạn</h1>
        <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
          Chọn gói phù hợp để tiếp cận hàng ngàn ứng viên tiềm năng nhanh nhất và tối ưu quy trình tuyển dụng.
        </p>

        {/* Hiển thị trạng thái VIP nếu đã mua */}
        {isVip && (
           <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 inline-block bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm"
           >
              <p className="flex items-center justify-center gap-2 font-bold text-blue-700 text-lg">
                 <CheckCircle className="w-6 h-6" /> Tài khoản Nhà Tuyển Dụng VIP
              </p>
              {formattedExpireDate && (
                  <p className="flex items-center justify-center gap-2 mt-1 text-sm text-blue-600">
                     <Clock size={16} /> Hết hạn vào: <span className="font-bold">{formattedExpireDate}</span>
                  </p>
              )}
              <p className="mt-2 text-xs text-gray-500">
                Bạn có thể mua thêm gói để cộng dồn thời gian sử dụng.
              </p>
           </motion.div>
        )}
      </motion.div>

      {/* 2. Bảng Giá */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Gói 1: Thường (Free) */}
        <PricingCard
          planName="Thường (Free)"
          price="0 VNĐ"
          description="Khởi đầu cơ bản cho các công ty nhỏ."
          features={freePlanFeatures}
          isFeatured={false}
          buttonText="Đang sử dụng"
          buttonDisabled={true} // Luôn disable vì là gói mặc định
        />
        
        {/* Gói 2: Pro (VIP) - Gói chính */}
        <div className="relative">
            {/* Hiệu ứng Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25"></div>
            <PricingCard
            planName="Pro (VIP)"
            price="99.999 VNĐ"
            description="Giải pháp tốt nhất để tìm kiếm nhân tài."
            features={proPlanFeatures}
            isFeatured={true}
            buttonText={isVip ? "Gia hạn ngay" : "Nâng cấp ngay"}
            onButtonClick={() => setIsModalOpen(true)} // Mở modal thanh toán
            />
        </div>
        
        {/* Gói 3: Doanh nghiệp (Enterprise) - Disable */}
        <PricingCard
          planName="Doanh nghiệp"
          price="Liên hệ"
          description="Giải pháp toàn diện cho các tập đoàn lớn."
          features={enterprisePlanFeatures}
          isFeatured={false}
          buttonText="Sắp ra mắt"
          buttonDisabled={true} // Disable nút này
          isGrayedOut={true} // Prop mới để làm xám
        />
        
      </div>

      {/* Modal Thanh Toán */}
      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EmployerVipPage;