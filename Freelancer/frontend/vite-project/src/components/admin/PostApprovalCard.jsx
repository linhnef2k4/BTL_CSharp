import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  AlertTriangle,
  User,
  ShieldCheck
} from 'lucide-react';

/**
 * Đây là "Card" (Card) "Chi tiết" (Detail) "để" (to) "Admin" (Admin) "xem" (review) "và" (and) "Duyệt/Từ chối" (Approve/Reject) "BÀI POST" (POST)
 * @param {object} props
 * @param {object} props.post - "Data" (Data) "của" (of) "cái" (the) "post" (post) "đang" (being) "chờ" (pending) "duyệt" (review)
 * @param {function} props.onApprove - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Duyệt" (Approve)
 * @param {function} props.onReject - "Hàm" (Function) "gọi" (call) "khi" (when) "bấm" (click) "Từ chối" (Reject)
 */
const PostApprovalCard = ({ post, onApprove, onReject }) => {
  // "State" (State) "nội bộ" (internal) "cho" (for) "cái" (the) "Modal" (Modal) "Từ chối" (Reject)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "bấm" (click) "nút" (button) "Từ chối" (Reject) "cuối cùng" (final)
  const handleRejectSubmit = () => {
    if (!rejectReason) {
      alert('Vui lòng nhập lý do từ chối.'); 
      return;
    }
    onReject(post.id, rejectReason); 
    setIsModalOpen(false);
    setRejectReason('');
  };

  // "Animation" (Animation) "cho" (for) "Modal" (Modal)
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <>
      {/* "CARD" (CARD) "CHI TIẾT" (DETAIL) "CHÍNH" (MAIN) */}
      <div className="rounded-xl bg-white shadow-lg h-full">
        {/* Header "Card" (Card) */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">Chi tiết Bài Post</h2>
          <p className="text-sm text-gray-500">
            Kiểm tra "từ khóa" (keywords) "cấm" (forbidden) (VD: "thô tục" (profane), "lừa đảo" (scam)...).
          </p>
        </div>

        {/* "Thân" (Body) "Card" (Card) (Scrollable) */}
        <div className="p-6 space-y-6 max-h-[calc(100vh-20rem)] overflow-y-auto">
          
          {/* Nhóm 1: Thông tin "Tác giả" (Author) (Clone "từ" (from) "PostCard" (PostCard)) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <User size={18} /> Tác giả
            </h3>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <img src={post.author.avatar} alt="Avatar" className="h-10 w-10 rounded-full" />
              <div>
                <h4 className="font-semibold">{post.author.name}</h4>
                <p className="text-xs text-gray-500">Đăng lúc: {post.author.time}</p>
              </div>
            </div>
          </section>

          {/* Nhóm 2: "Nội dung" (Content) "Bài Post" (Post) */}
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ShieldCheck size={18} /> Nội dung Cần duyệt
            </h3>
            
            {/* "Khung" (Frame) "Nội dung" (Content) */}
            <div className="space-y-4 rounded-lg border p-4">
              {/* "Văn bản" (Text) "Nội dung" (Content) */}
              <p className="text-gray-800 whitespace-pre-wrap">
                {post.content}
              </p>
              
              {/* "Ảnh" (Image) (nếu "có" (if any)) */}
              {post.image && (
                <div className="mt-4">
                  <img 
                    src={post.image} 
                    alt="Nội dung ảnh" 
                    className="w-full max-h-80 rounded-lg object-cover border"
                  />
                </div>
              )}
            </div>
          </section>

        </div>

        {/* "Footer" (Footer) "Card" (Card) (Nút "Hành động" (Action)) */}
        <div className="p-4 bg-gray-50 rounded-b-xl border-t flex justify-end space-x-3">
          <button
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-red-700"
          >
            <X size={18} />
            Từ chối
          </button>
          <button
            onClick={() => onApprove(post.id)} 
            className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 
                       font-semibold text-white shadow-lg transition-all 
                       hover:scale-105 hover:bg-green-700"
          >
            <Check size={18} />
            Duyệt Post
          </button>
        </div>
      </div>

      {/* --- "MODAL" (MODAL) "TỪ CHỐI" (REJECT) (Copy "y hệt" (exact copy) "từ" (from) "file" (file) "trước" (previous)) --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)} 
          >
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-lg rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()} 
            >
              {/* Header "Modal" (Modal) */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle />
                  Xác nhận Từ chối Bài Post?
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* "Nội dung" (Body) "Modal" (Modal) (CHỨA "FORM" (FORM)) */}
              <div className="p-6 space-y-4">
                <p className="text-gray-700">
                  Bạn sắp từ chối bài post của: <span className="font-bold">{post.author.name}</span>
                </p>
                
                {/* "Form" (Form) "Nhập" (Input) "Lý do" (Reason) (BẮT BUỘC) (MANDATORY) */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
                    Lý do Từ chối (Bắt buộc): *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="VD: Vi phạm từ khóa, nội dung không phù hợp, spam..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* "Nút" (Buttons) "Hủy" (Cancel) "và" (and) "Xác nhận" (Confirm) "Từ chối" (Reject) */}
              <div className="flex justify-end space-x-3 p-4 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800
                             hover:bg-gray-300"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit} 
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700
                             disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!rejectReason} 
                >
                  <ShieldCheck size={16} />
                  Xác nhận Từ chối
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* --- HẾT "MODAL" (MODAL) --- */}
    </>
  );
};

export default PostApprovalCard;