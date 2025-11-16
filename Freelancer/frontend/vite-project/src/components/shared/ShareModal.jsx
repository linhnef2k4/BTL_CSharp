import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ArrowLeft, Send, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios'; // <<< IMPORT

// --- Dữ liệu giả (mock) ĐÃ BỊ XÓA ---
// const mockContacts = [ ... ];

// Hàm tạo avatar (lặp lại)
const getAvatarUrl = (name) => {
  const Fname = name?.replace(/\s/g, '+') || '?';
  return `https://ui-avatars.com/api/?name=${Fname}&background=random&color=fff`;
}

const ShareModal = ({ isOpen, onClose, postId }) => { // <<< 1. Nhận postId
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");

  // <<< 2. Lấy danh sách bạn bè thật khi modal mở
  useEffect(() => {
    if (isOpen) {
      const fetchFriends = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          setIsLoading(false);
          return;
        }
        try {
          // Gọi API /api/friends
          const response = await axios.get('/api/friends', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // DTO trả về: [{ friendId, friendFullName, ... }]
          setFriends(response.data); 
        } catch (error) {
          console.error("Lỗi khi tải danh sách bạn bè:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchFriends();
    } else {
      // Reset khi modal đóng
      setSelectedUsers([]);
      setMessage("");
    }
  }, [isOpen]);

  const toggleUserSelection = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  // <<< 3. Hàm gửi (chưa có API)
  const handleSendShare = async () => {
    setIsSending(true);
    // TODO: Bạn cần một API để xử lý việc "chia sẻ" (gửi tin nhắn)
    // Ví dụ: await axios.post('/api/messages/share-post', 
    //   { postId, userIds: selectedUsers, message }, 
    //   { headers: { Authorization: `Bearer ${token}` } }
    // );
    
    console.log("Chia sẻ post", postId, "cho", selectedUsers, "với lời nhắn:", message);
    
    // Giả lập 1s gửi
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSending(false);
    onClose();
  };

  // (Các variants giữ nguyên)
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 40 }, visible: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: 20 } };

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

            {/* <<< 4. DANH SÁCH BẠN BÈ THẬT */}
            <div className="flex space-x-4 overflow-x-auto px-4 py-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-blue-500 animate-spin mx-auto" />
              ) : friends.length === 0 ? (
                <span className="text-sm text-gray-500 italic">Bạn chưa có bạn bè để chia sẻ.</span>
              ) : (
                friends.map((friend) => {
                  const isSelected = selectedUsers.includes(friend.friendId);
                  return (
                    <motion.button
                      key={friend.friendId}
                      onClick={() => toggleUserSelection(friend.friendId)}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex flex-col items-center w-20 flex-shrink-0"
                    >
                      <div className="relative">
                        <img
                          src={getAvatarUrl(friend.friendFullName)} // Dùng tên thật
                          alt={friend.friendFullName}
                          className={`h-14 w-14 rounded-full object-cover border-2 ${
                            isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                          } transition-all duration-200`}
                        />
                        {/* (Tạm ẩn online status) */}
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
                        {friend.friendFullName} {/* Dùng tên thật */}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* INPUT TIN NHẮN */}
            <div className="px-4 pb-3">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Thêm lời nhắn (không bắt buộc)..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none transition-all duration-200"
                />
              </div>
            </div>

            {/* NÚT GỬI */}
            <div className="px-4 pb-5">
              <motion.button
                onClick={handleSendShare}
                disabled={selectedUsers.length === 0 || isSending}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-semibold text-white shadow-md transition-all duration-200 ${
                  selectedUsers.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                } disabled:opacity-70`}
              >
                {isSending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
                {isSending
                  ? 'Đang gửi...'
                  : selectedUsers.length > 0
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
