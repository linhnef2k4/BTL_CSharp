import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Image, Video, Smile, Loader2 } from 'lucide-react'; // Thêm Loader2

// Danh sách emoji "giả"
const EMOJIS = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🤔', '🙏'];

// Hàm tạo avatar (lặp lại ở đây để component độc lập)
const getAvatarUrl = (user) => {
  if (user?.seeker?.avatarUrl) {
    return user.seeker.avatarUrl;
  }
  const name = user?.fullName?.replace(/\s/g, '+') || '?';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
}

const CreatePostModal = ({ isOpen, onClose, user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Giữ file "giả"
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái loading
  
  // Ref để reset input file
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // TODO: XỬ LÝ UPLOAD FILE THẬT Ở ĐÂY
    // 1. Bạn cần một API endpoint (ví dụ: /api/files/upload)
    // 2. Upload `selectedFile` lên đó.
    // 3. API trả về một 'imageUrl' (ví dụ: "https://cdn.yourserver.com/image.png")
    
    // ----- BẮT ĐẦU GIẢ LẬP -----
    let imageUrl = null;
    if (selectedFile) {
      // Giả lập imageUrl từ file đã chọn
      imageUrl = `https://placehold.co/600x400/cccccc/ffffff?text=${selectedFile.name}`;
    }
    // ----- KẾT THÚC GIẢ LẬP -----

    // Gọi hàm API thật từ MainFeed
    await onCreatePost(postContent, imageUrl); 

    // Reset trạng thái
    setIsSubmitting(false);
    setPostContent('');
    setSelectedFile(null);
    setShowEmojiPicker(false);
    onClose();
  };

  const handleEmojiClick = (emoji) => {
    setPostContent(prev => prev + emoji);
  };

  const handleFileChange = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      // Tạm thời chỉ lưu tên và loại file (giả lập)
      setSelectedFile({ name: file.name, type: type, fileObject: file });
    }
    // Reset input để có thể chọn lại file
    if (fileInputRef.current) fileInputRef.current.value = null;
    if (videoInputRef.current) videoInputRef.current.value = null;
  };

  // (Các variants giữ nguyên)
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // Lấy tên đầu tiên
  const firstName = user.fullName ? user.fullName.split(' ')[0] : 'bạn';

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
            className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative border-b p-4 text-center rounded-t-2xl bg-gray-50">
              <h3 className="text-xl font-bold">Tạo bài viết</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting} // Không cho đóng khi đang submit
                className="absolute right-3 top-3 rounded-full bg-gray-200 p-2 hover:bg-gray-300 transition disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info (Đã cập nhật) */}
            <div className="flex items-center space-x-3 p-4">
              <img
                src={getAvatarUrl(user)} // <<< Dùng avatar thật
                alt="Avatar"
                className="h-10 w-10 rounded-full border border-gray-300 shadow-sm object-cover"
              />
              <span className="font-semibold">{user.fullName}</span> {/* <<< Dùng tên thật */}
            </div>

            {/* Text Input */}
            <div className="px-4">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`Chia sẻ kinh nghiệm của bạn, ${firstName}?`}
                className="h-40 w-full resize-none rounded-xl border border-gray-200 p-3 text-lg placeholder-gray-500 focus:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              {selectedFile && (
                <div className="mt-2 text-sm text-blue-600">
                  📎 Đã đính kèm: {selectedFile.name}
                  <button 
                    onClick={() => setSelectedFile(null)} 
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    (Xóa)
                  </button>
                </div>
              )}
            </div>

            {/* Emoji Picker (Giữ nguyên) */}
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-2 border-t border-b p-3 mx-4 rounded-lg bg-gray-50">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    className="text-2xl rounded-full p-1 hover:bg-gray-200 transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Nút chức năng (Giữ nguyên) */}
            <div className="m-4 flex items-center justify-between rounded-xl border p-3 bg-gray-50">
              <span className="font-medium text-gray-700">Thêm vào bài viết</span>
              <div className="flex space-x-2">
                <label className="cursor-pointer rounded-full p-2 text-green-500 hover:bg-gray-100 transition">
                  <Image size={24} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'Ảnh')}
                  />
                </label>
                {/* (Tạm thời vô hiệu hóa Video vì DTO chỉ có ImageUrl) */}
                <label className="cursor-pointer rounded-full p-2 text-red-500 opacity-50 cursor-not-allowed" title="Tính năng đang phát triển">
                  <Video size={24} />
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'Video')}
                    disabled
                  />
                </label>
                <button
                  onClick={() => setShowEmojiPicker(prev => !prev)}
                  className={`rounded-full p-2 text-yellow-500 hover:bg-gray-100 transition ${showEmojiPicker ? 'bg-gray-200' : ''}`}
                >
                  <Smile size={24} />
                </button>
              </div>
            </div>

            {/* Nút Đăng (Cập nhật) */}
            <div className="p-4">
              <button
                onClick={handleSubmit}
                disabled={(!postContent.trim() && !selectedFile) || isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-2 font-bold text-white shadow-md hover:bg-blue-700 transition disabled:cursor-not-allowed disabled:bg-gray-300 flex justify-center items-center"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Đăng'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
