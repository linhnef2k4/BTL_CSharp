import React, { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Image, Smile, Loader2 } from 'lucide-react';

const EMOJIS = ['😀', '😂', '😍', '👍', '❤️', '🔥', '🤔', '🙏'];

const getAvatarUrl = (user) => {
  if (user?.seeker?.avatarUrl) return user.seeker.avatarUrl;
  const name = user?.fullName?.replace(/\s/g, '+') || 'User';
  return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff`;
};

const CreatePostModal = ({ isOpen, onClose, user, onCreatePost }) => {
  const [postContent, setPostContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(null); // Xem trước ảnh
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // --- GIẢ LẬP UPLOAD ---
    // Vì API hiện tại nhận chuỗi 'imageUrl', ta cần upload file lên server trước
    // Ở đây tạm thời giả lập bằng link placeholder nếu có file
    let finalImageUrl = null;
    if (selectedFile) {
       // Logic thực tế: Gọi API upload file -> nhận về URL -> gán vào finalImageUrl
       finalImageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(selectedFile.name)}`;
    }
    // ---------------------

    await onCreatePost(postContent, finalImageUrl); 

    // Reset
    setIsSubmitting(false);
    setPostContent('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowEmojiPicker(false);
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Tạo URL xem trước local
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const removeFile = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
  }

  // Animations
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.95, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Tạo bài viết</h3>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full p-2 hover:bg-gray-200 transition text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3 p-4">
              <img
                src={getAvatarUrl(user)}
                alt="Avatar"
                className="h-10 w-10 rounded-full object-cover border"
              />
              <div>
                <div className="font-semibold text-gray-900">{user.fullName}</div>
                <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">Công khai</div>
              </div>
            </div>

            {/* Input Area */}
            <div className="px-4 py-2 h-52 overflow-y-auto custom-scrollbar">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder={`Bạn đang nghĩ gì thế, ${user.fullName.split(' ')[0]}?`}
                className="w-full h-full resize-none text-lg placeholder-gray-400 focus:outline-none"
              />
              
              {/* Image Preview */}
              {previewUrl && (
                <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
                   <img src={previewUrl} alt="Preview" className="w-full object-cover max-h-60" />
                   <button 
                     onClick={removeFile}
                     className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white text-red-500 shadow-sm"
                   >
                     <X size={16} />
                   </button>
                </div>
              )}
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-2 px-4 py-2 bg-gray-50 border-t border-gray-100">
                {EMOJIS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setPostContent(prev => prev + emoji)}
                    className="text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100">
               <div className="flex items-center justify-between mb-4 px-3 py-2 border border-gray-200 rounded-lg shadow-sm">
                  <span className="text-sm font-medium text-gray-700">Thêm vào bài viết</span>
                  <div className="flex gap-1">
                     <label className="p-2 hover:bg-gray-100 rounded-full cursor-pointer text-green-600 transition">
                        <Image size={20} />
                        <input 
                           ref={fileInputRef} 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           onChange={handleFileChange} 
                        />
                     </label>
                     <button 
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 hover:bg-gray-100 rounded-full text-yellow-500 transition"
                     >
                        <Smile size={20} />
                     </button>
                  </div>
               </div>

               <button
                onClick={handleSubmit}
                disabled={(!postContent.trim() && !selectedFile) || isSubmitting}
                className="w-full rounded-xl bg-blue-600 py-2.5 font-bold text-white shadow-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                {isSubmitting ? 'Đang đăng...' : 'Đăng bài'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;