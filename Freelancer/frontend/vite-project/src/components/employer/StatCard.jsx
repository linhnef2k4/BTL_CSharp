import React from 'react';
import { motion } from 'framer-motion';

/**
 * Một component thẻ (card) "xịn" để hiển thị thống kê (stats).
 * @param {object} props
 * @param {React.ReactNode} props.icon - Icon (từ lucide-react, vd: <Briefcase />)
 * @param {string} props.title - Tiêu đề (vd: "Job đang đăng")
 * @param {string} props.value - Giá trị (vd: "12")
 * @param {string} props.change - % thay đổi (vd: "+5.2%")
 * @param {string} props.changeType - "positive" (xanh) hoặc "negative" (đỏ)
 */
const StatCard = ({ icon, title, value, change, changeType = 'positive' }) => {
  
  // Logic màu cho % thay đổi
  const changeColor = changeType === 'positive' 
    ? 'text-green-500' 
    : 'text-red-500';

  return (
    <motion.div
      className="relative overflow-hidden rounded-xl bg-white p-5 shadow-lg"
      // Animation "lộng lẫy" khi di chuột (hover)
      whileHover={{ y: -5, scale: 1.03, shadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="flex items-center justify-between">
        {/* Tiêu đề */}
        <span className="text-sm font-medium text-gray-500">{title}</span>
        
        {/* Icon (nền "mờ") */}
        <div className="rounded-full bg-blue-100 p-2 text-blue-600">
          {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
        </div>
      </div>
      
      {/* Giá trị chính */}
      <div className="mt-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
      </div>
      
      {/* % Thay đổi */}
      {change && (
        <div className="mt-1 flex items-center space-x-1">
          <span className={`text-sm font-semibold ${changeColor}`}>
            {change}
          </span>
          <span className="text-xs text-gray-400">so với tháng trước</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;