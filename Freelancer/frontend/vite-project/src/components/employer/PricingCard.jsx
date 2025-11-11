import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';

/**
 * Đây là 1 "Card" (thẻ) "hiển thị" (display) "1" (one) "Gói cước" (Pricing Plan)
 * @param {object} props
 * @param {string} props.planName - Tên gói (VD: "Pro")
 * @param {string} props.price - Giá (VD: "2.000.000 VNĐ")
 * @param {string} props.description - Mô tả ngắn
 * @param {Array<string>} props.features - Danh sách các tính năng (string array)
 * @param {boolean} props.isFeatured - "True" (True) "nếu" (if) "đây" (this) "là" (is) "gói" (plan) "nổi bật" (featured)
 */
const PricingCard = ({ planName, price, description, features, isFeatured = false }) => {
  
  // "Logic" (Logic) "Style" (Style) "cho" (for) "gói" (plan) "nổi bật" (featured) (nền "xanh" (blue), "chữ" (text) "trắng" (white))
  const cardClasses = isFeatured
    ? 'bg-blue-600 text-white shadow-2xl scale-105' // Style "Nổi bật" (Featured)
    : 'bg-white text-gray-900 shadow-lg'; // Style "Thường" (Normal)
  
  const buttonClasses = isFeatured
    ? 'bg-white text-blue-600 hover:bg-gray-100' // Button "Nổi bật" (Featured)
    : 'bg-blue-600 text-white hover:bg-blue-700'; // Button "Thường" (Normal)

  return (
    <motion.div
      className={`relative rounded-2xl p-6 ${cardClasses} transition-all duration-300`}
      whileHover={{ y: -5 }} // "Nảy" (Bounce) "lên" (up) "khi" (when) "hover" (hover)
    >
      {/* "Tag" (Tag) "Nổi bật" (Featured) (nếu "có" (is)) */}
      {isFeatured && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 
                        flex items-center gap-1 rounded-full 
                        bg-yellow-400 px-3 py-1 text-xs font-bold text-gray-900">
          <Star size={12} fill="currentColor" />
          GIÁ TỐT NHẤT
        </div>
      )}

      {/* 1. Tên Gói */}
      <h3 className="text-lg font-semibold uppercase tracking-wide">{planName}</h3>
      
      {/* 2. Giá tiền */}
      <div className="mt-4">
        <span className="text-4xl font-bold">{price}</span>
        <span className={isFeatured ? 'text-blue-100' : 'text-gray-500'}> / tháng</span>
      </div>
      <p className={`mt-2 text-sm ${isFeatured ? 'text-blue-100' : 'text-gray-600'}`}>
        {description}
      </p>
      
      {/* 3. Nút "Mua" (Buy) */}
      <button 
        className={`w-full rounded-lg px-4 py-2.5 mt-6 font-semibold shadow-md transition-all ${buttonClasses}`}
      >
        Nâng cấp ngay
      </button>

      {/* 4. Danh sách "Tính năng" (Features) */}
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li key={feature} className="flex items-center space-x-2">
            <CheckCircle 
              size={18} 
              className={isFeatured ? 'text-yellow-400' : 'text-green-500'} 
            />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default PricingCard;