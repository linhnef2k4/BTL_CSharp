import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Eye, Key, ShieldOff, CheckCircle, X, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../../services/adminService';
import { useToast } from '../../context/ToastContext';

const UserActions = ({ user, onSuccess }) => {
  const { addToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- 1. XỬ LÝ KHÓA / MỞ KHÓA ---
  const handleToggleLock = async () => {
    setIsLoading(true);
    try {
      await adminService.toggleUserLock(user.id);
      addToast(`Đã ${user.isLocked ? 'mở khóa' : 'khóa'} tài khoản thành công.`, 'success');
      if (onSuccess) onSuccess(); // Refresh list
      setIsModalOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      addToast("Lỗi khi thay đổi trạng thái tài khoản.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. XỬ LÝ ĐẶT LẠI MẬT KHẨU ---
  const handleResetPassword = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.resetUserPassword(user.id);
      // API trả về NewPassword
      const newPass = res.data.NewPassword || "1"; 
      addToast(`Đặt lại mật khẩu thành công. Mật khẩu mới: ${newPass}`, 'success');
      
      setIsResetModalOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      addToast("Lỗi khi đặt lại mật khẩu.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Dropdown animation
  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <div className="relative inline-block text-left">
      {/* Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <MoreHorizontal size={20} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-0 z-20 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden"
            >
              <div className="py-1">
                <Link 
                  to={`/profile/${user.id}`} // Link tới trang Profile (đã có)
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Eye size={16} className="text-blue-500" /> Xem trang cá nhân
                </Link>
                
                <button 
                  onClick={() => setIsResetModalOpen(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition text-left"
                >
                  <Key size={16} className="text-orange-500" /> Đặt lại mật khẩu
                </button>
                
                <div className="border-t border-gray-100 my-1"></div>
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition text-left
                    ${user.isLocked ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
                >
                  {user.isLocked ? <CheckCircle size={16} /> : <ShieldOff size={16} />}
                  {user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MODAL XÁC NHẬN KHÓA/MỞ KHÓA --- */}
      <AnimatePresence>
        {isModalOpen && (
            <ConfirmModal 
                title={user.isLocked ? "Mở khóa tài khoản?" : "Khóa tài khoản này?"}
                description={`Bạn có chắc chắn muốn ${user.isLocked ? 'mở khóa' : 'khóa'} tài khoản của ${user.fullName}?`}
                icon={user.isLocked ? <CheckCircle size={48} className="text-green-500"/> : <AlertTriangle size={48} className="text-red-500"/>}
                confirmText={user.isLocked ? "Mở khóa" : "Xác nhận khóa"}
                confirmColor={user.isLocked ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleToggleLock}
                isLoading={isLoading}
            />
        )}
      </AnimatePresence>

      {/* --- MODAL XÁC NHẬN RESET PASSWORD --- */}
      <AnimatePresence>
        {isResetModalOpen && (
            <ConfirmModal 
                title="Đặt lại mật khẩu?"
                description={`Mật khẩu của ${user.fullName} sẽ được đưa về mặc định là "1". Bạn có chắc chắn không?`}
                icon={<Key size={48} className="text-orange-500"/>}
                confirmText="Đặt lại ngay"
                confirmColor="bg-orange-500 hover:bg-orange-600"
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleResetPassword}
                isLoading={isLoading}
            />
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper Component cho Modal (để code gọn hơn)
const ConfirmModal = ({ title, description, icon, confirmText, confirmColor, onClose, onConfirm, isLoading }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-center mb-4">{icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-6">{description}</p>
            
            <div className="flex gap-3">
                <button 
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                    Hủy bỏ
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-white shadow-md transition flex justify-center items-center gap-2 ${confirmColor}`}
                >
                    {isLoading && <Loader2 className="animate-spin w-4 h-4" />}
                    {confirmText}
                </button>
            </div>
        </motion.div>
    </div>
);

export default UserActions;