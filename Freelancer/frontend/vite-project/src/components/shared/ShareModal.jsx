import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, Send, CheckCircle } from 'lucide-react';

// Dữ liệu giả (mock)
const mockContacts = [
  { id: 1, name: 'Nguyễn Sáng', avatar: 'https://ui-avatars.com/api/?name=NS&background=random', online: true },
  { id: 2, name: 'Đi đâu 2025', avatar: 'https://ui-avatars.com/api/?name=DD&background=random', online: true },
  { id: 3, name: 'Trịnh Xuân Thi', avatar: 'https://ui-avatars.com/api/?name=TT&background=random', online: false },
  { id: 4, name: 'Phạm Văn Huy', avatar: 'https://ui-avatars.com/api/?name=PH&background=random', online: true },
  { id: 5, name: 'Đào Xuân Thông', avatar: 'https://ui-avatars.com/api/?name=DT&background=random', online: true },
];

const ShareModal = ({ isOpen, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 40 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 180, damping: 20 } },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/20 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h3 className="text-lg font-semibold tracking-wide">Chia sẻ cho bạn bè</h3>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-white/20 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* DANH SÁCH BẠN BÈ */}
            <div className="flex space-x-4 overflow-x-auto px-4 py-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {mockContacts.map((user) => {
                const isSelected = selectedUsers.includes(user.id);
                return (
                  <motion.button
                    key={user.id}
                    onClick={() => toggleUserSelection(user.id)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex flex-col items-center w-20 flex-shrink-0"
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className={`h-14 w-14 rounded-full object-cover border-2 ${
                          isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                        } transition-all duration-200`}
                      />
                      {user.online && (
                        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                      )}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -right-1 -bottom-1 rounded-full bg-white"
                        >
                          <CheckCircle size={20} className="text-blue-500 fill-current" />
                        </motion.div>
                      )}
                    </div>
                    <span className="mt-2 text-xs text-gray-700 text-center font-medium leading-tight">
                      {user.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* INPUT TIN NHẮN */}
            <div className="px-4 pb-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Thêm lời nhắn (không bắt buộc)..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* NÚT GỬI */}
            <div className="px-4 pb-5">
              <motion.button
                whileHover={{ scale: selectedUsers.length > 0 ? 1.03 : 1 }}
                whileTap={{ scale: selectedUsers.length > 0 ? 0.96 : 1 }}
                disabled={selectedUsers.length === 0}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white shadow-md transition-all duration-200 ${
                  selectedUsers.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Send size={18} />
                {selectedUsers.length > 0
                  ? `Gửi (${selectedUsers.length})`
                  : 'Chọn bạn để gửi'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
