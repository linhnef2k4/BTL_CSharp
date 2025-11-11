import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CreditCard, Lock, User, Calendar, AlertTriangle } from 'lucide-react';

// Component con cho Input "xịn"
const FormInput = ({ icon, ...props }) => (
  <div className="relative">
    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      {icon}
    </div>
    <input
      {...props}
      className="w-full rounded-md border-gray-300 py-2 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
    />
  </div>
);

const PaymentModal = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    // --- GIẢ LẬP GỌI API THANH TOÁN ---
    setTimeout(() => {
      // (Giả lập lỗi ngẫu nhiên)
      if (Math.random() > 0.8) {
        setError('Thanh toán thất bại. Vui lòng thử lại.');
      } else {
        // (Thành công -> sau này sẽ đóng modal, báo toast,...)
        console.log('Thanh toán thành công!');
        onClose(); // Đóng modal
      }
      setIsSubmitting(false);
    }, 1500); // Giả lập 1.5 giây
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-md rounded-xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()} // Ngăn click xuyên qua
          >
            {/* Header */}
            <div className="relative rounded-t-xl bg-gray-100 p-4 text-center">
              <h3 className="text-xl font-bold">Thanh Toán VIP</h3>
              <p className="text-sm text-gray-500">Hoàn tất để mở khóa đặc quyền</p>
              <button
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full bg-gray-200 p-2 hover:bg-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Form (dùng yup + react-hook-form sau) */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-center">
                <p className="font-semibold text-blue-800">Gói VIP</p>
                <p className="text-3xl font-bold text-blue-900">99.000 VNĐ / tháng</p>
              </div>

              {/* Thông báo lỗi */}
              {error && (
                <div className="flex items-center space-x-2 rounded-md bg-red-50 p-3 text-sm text-red-700">
                  <AlertTriangle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Input "Giả lập" (cho đẹp) */}
              <FormInput 
                icon={<User size={16} className="text-gray-400" />} 
                type="text" 
                placeholder="Họ và Tên trên thẻ" 
                required 
              />
              <FormInput 
                icon={<CreditCard size={16} className="text-gray-400" />} 
                type="text" 
                placeholder="Số thẻ (xxxx xxxx xxxx xxxx)" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <FormInput 
                  icon={<Calendar size={16} className="text-gray-400" />} 
                  type="text" 
                  placeholder="Ngày hết hạn (MM/YY)" 
                  required 
                />
                <FormInput 
                  icon={<Lock size={16} className="text-gray-400" />} 
                  type="text" 
                  placeholder="CVV" 
                  required 
                />
              </div>

              {/* Nút Thanh Toán */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white shadow-lg transition-all
                           hover:bg-blue-700
                           disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? 'Đang xử lý...' : 'Thanh toán 99.000 VNĐ'}
              </button>

              <p className="text-center text-xs text-gray-500">
                Thanh toán an toàn được bảo vệ bởi Stripe.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;