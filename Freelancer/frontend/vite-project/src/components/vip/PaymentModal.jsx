import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CreditCard, ShieldCheck, Loader2, AlertTriangle } from 'lucide-react';
import paymentService from '../../../services/paymentService';
import { useAuth } from '../../context/AuthContext';

const PaymentModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // <<< SỬA Ở ĐÂY: Luôn gọi API tạo đơn cho SEEKER >>>
      // (Không cần check Role Employer nữa vì trang này chỉ dành cho Seeker)
      const response = await paymentService.createVipOrderSeeker();

      // Backend trả về: { paymentUrl: "..." }
      const { paymentUrl } = response.data;

      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError('Không nhận được link thanh toán. Vui lòng thử lại.');
      }

    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      const serverMessage = err.response?.data || 'Có lỗi xảy ra khi khởi tạo giao dịch.';
      setError(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Phần render giữ nguyên như cũ)
  // Animation variants
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 50 }, visible: { opacity: 1, scale: 1, y: 0 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-center text-white">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
                <ShieldCheck /> Nâng cấp Seeker VIP
              </h3>
              <p className="text-blue-100 text-sm mt-1">Dành riêng cho Ứng viên</p>
              <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 hover:bg-white/30 transition">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 text-center">
                <p className="font-semibold text-blue-800 uppercase tracking-wider text-xs mb-1">Gói Ứng Viên VIP</p>
                <p className="text-3xl font-extrabold text-blue-900">500.000 VNĐ</p>
                <p className="text-sm text-blue-600 mt-1">Thanh toán 1 lần / Vĩnh viễn</p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span>Tài khoản:</span>
                  <span className="font-semibold text-gray-800">{user?.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phương thức:</span>
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                     <CreditCard size={16} className="text-blue-600" /> VNPay (ATM/QR/Visa)
                  </span>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handlePayment}
                disabled={isSubmitting}
                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 font-bold text-white shadow-lg transition-all
                           hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                    <> <Loader2 className="animate-spin" size={20} /> Đang kết nối VNPay... </>
                ) : 'Thanh toán ngay'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;