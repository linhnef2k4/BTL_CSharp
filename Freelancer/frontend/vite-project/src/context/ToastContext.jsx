import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Tạo Context
const ToastContext = createContext();

// Custom hook để sử dụng dễ dàng
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast phải được sử dụng bên trong ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Hàm thêm thông báo
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now(); // Tạo ID duy nhất dựa trên thời gian
    setToasts((prev) => [...prev, { id, message, type }]);

    // Tự động tắt sau 3 giây
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  // Hàm xóa thông báo thủ công
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Container hiển thị danh sách Toast (Góc trên bên phải) */}
      <div className="fixed top-24 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`pointer-events-auto flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-lg border-l-4 bg-white
                ${toast.type === 'success' ? 'border-green-500' : 
                  toast.type === 'error' ? 'border-red-500' : 
                  'border-blue-500'}`}
            >
              {/* Icon dựa trên loại thông báo */}
              <div className="flex-shrink-0">
                {toast.type === 'success' && <CheckCircle className="text-green-500" size={24} />}
                {toast.type === 'error' && <AlertCircle className="text-red-500" size={24} />}
                {toast.type === 'info' && <Info className="text-blue-500" size={24} />}
              </div>
              
              {/* Nội dung */}
              <p className="text-sm font-medium text-gray-700 flex-1 break-words">
                {toast.message}
              </p>
              
              {/* Nút đóng */}
              <button 
                onClick={() => removeToast(toast.id)} 
                className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};