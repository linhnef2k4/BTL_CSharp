import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const ToastNotification = ({ message, onClose }) => {
  // Tự động đóng sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-20 right-5 z-50 flex items-center space-x-3 rounded-lg bg-white p-4 shadow-xl"
      // Animation trượt vào từ bên phải
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <CheckCircle className="h-6 w-6 text-green-500" />
      <span className="font-semibold text-gray-800">{message}</span>
      <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
        <X size={18} />
      </button>
    </motion.div>
  );
};

export default ToastNotification;