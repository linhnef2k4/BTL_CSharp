import React from 'react';
import { motion } from 'framer-motion';

/**
 * Đây là 1 "Card" (thẻ) "Thống kê" (Stat) "xịn" (pro) "cho" (for) "Admin" (Admin)
 * @param {object} props
 * @param {string} props.title - "Tiêu đề" (Title) (VD: "Tổng Doanh thu")
 * @param {string} props.value - "Giá trị" (Value) (VD: "120.000.000 VNĐ")
 * @param {string} props.change - "Thay đổi" (Change) (VD: "+15.2%")
 * @param {boolean} props.isPositive - "True" (True) "nếu" (if) "là" (is) "thay đổi" (change) "tốt" (good) (màu "xanh" (green))
 * @param {React.ReactNode} props.icon - "Icon" (Icon) "từ" (from) "Lucide" (Lucide)
 * @param {string} props.bgColor - "Màu" (Color) "nền" (background) "cho" (for) "icon" (icon)
 */
const AdminStatCard = ({ title, value, change, isPositive, icon, bgColor }) => {
  return (
    <motion.div
      className="rounded-xl bg-white p-5 shadow-lg transition-all duration-300"
      whileHover={{ y: -5, shadow: 'rgba(0, 0, 0, 0.1) 0px 10px 20px' }} // "Nổi" (Pop) "lên" (up) "khi" (when) "hover" (hover)
    >
      <div className="flex items-center justify-between">
        
        {/* 1. "Icon" (Icon) "và" (and) "Tiêu đề" (Title) */}
        <div className="flex items-center space-x-3">
          <div className={`rounded-full p-3 ${bgColor}`}>
            {/* "Clone" (Clone) "icon" (icon) "để" (to) "thêm" (add) "class" (class) "cho" (for) "nó" (it) */}
            {React.cloneElement(icon, { size: 24, className: 'text-white' })}
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-gray-500">{title}</p>
            {/* 2. "Giá trị" (Value) "LỚN" (BIG) */}
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>

        {/* 3. "Thay đổi" (Change) "%" (%) */}
        <span
          className={`text-sm font-semibold px-2 py-1 rounded-full
                      ${isPositive 
                        ? 'bg-green-100 text-green-700' // "Tốt" (Good) (màu "xanh" (green))
                        : 'bg-red-100 text-red-700'     // "Xấu" (Bad) (màu "đỏ" (red))
                      }`}
        >
          {change}
        </span>
        
      </div>
    </motion.div>
  );
};

export default AdminStatCard;