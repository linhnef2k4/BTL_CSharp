import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Star, Lock } from 'lucide-react';

const PricingCard = ({ 
  planName, 
  price, 
  description, 
  features, 
  isFeatured = false,
  buttonText = "Chọn gói này",
  buttonDisabled = false,
  onButtonClick,
  isGrayedOut = false // Prop mới để làm mờ card chưa phát triển
}) => {
  
  const cardClasses = isFeatured
    ? 'bg-white border-2 border-blue-500 shadow-xl scale-105 z-10' 
    : 'bg-white border border-gray-200 shadow-sm';

  const containerClasses = isGrayedOut ? 'opacity-60 grayscale cursor-not-allowed' : '';

  return (
    <motion.div
      className={`relative rounded-2xl p-8 flex flex-col h-full ${cardClasses} ${containerClasses} transition-all duration-300`}
      whileHover={!isGrayedOut && !buttonDisabled ? { y: -5 } : {}}
    >
      {isFeatured && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 
                        flex items-center gap-1 rounded-full 
                        bg-blue-600 px-4 py-1 text-xs font-bold text-white shadow-md tracking-wide uppercase">
          <Star size={12} fill="currentColor" />
          Khuyên dùng
        </div>
      )}

      <div className="mb-6">
          <h3 className="text-xl font-bold uppercase tracking-wide text-gray-900">{planName}</h3>
          <div className="mt-4 flex items-baseline text-gray-900">
            <span className="text-4xl font-extrabold tracking-tight">{price}</span>
            {price !== 'Liên hệ' && price !== '0 VNĐ' && <span className="ml-1 text-xl font-semibold text-gray-500">/tháng</span>}
          </div>
          <p className="mt-4 text-gray-500 text-sm">{description}</p>
      </div>

      {/* Danh sách tính năng */}
      <ul className="mt-2 space-y-4 flex-1">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckCircle 
              size={20} 
              className={`flex-shrink-0 ${isFeatured ? 'text-blue-600' : 'text-green-500'}`} 
            />
            <span className="text-sm text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Nút bấm */}
      <button 
        onClick={onButtonClick}
        disabled={buttonDisabled || isGrayedOut}
        className={`w-full rounded-xl px-4 py-3 mt-8 font-bold text-sm transition-all shadow-md
            ${isFeatured 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}
            ${(buttonDisabled || isGrayedOut) ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none hover:bg-gray-100' : ''}
        `}
      >
        {isGrayedOut ? (
            <span className="flex items-center justify-center gap-2"><Lock size={16}/> {buttonText}</span>
        ) : buttonText}
      </button>
    </motion.div>
  );
};

export default PricingCard;