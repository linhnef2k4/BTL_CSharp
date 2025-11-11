import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// "Icon" (Icon) "cho" (for) "Tab" (Tab) "này" (this): "Cảnh báo" (Warning) "và" (and) "Xóa" (Delete)
import { AlertTriangle, Trash2, X } from 'lucide-react'; 

// --- "Linh kiện" (Component) "con" (child) (Copy "từ" (from) "File 2/5 & 3/5") ---
// 1. "Card" (Card) "Bọc" (Wrapper)
const SectionCard = ({ title, children, isDanger = false }) => (
  <motion.div
    // "Nếu" (If) "là" (is) "Vùng Nguy Hiểm" (Danger Zone), "thêm" (add) "viền" (border) "đỏ" (red)
    className={`rounded-xl bg-white p-6 shadow-lg ${isDanger ? 'border border-red-500' : ''}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {/* "Nếu" (If) "là" (is) "Vùng Nguy Hiểm" (Danger Zone), "thêm" (add) "icon" (icon) "đỏ" (red) "vào" (to) "tiêu đề" (title) */}
    <h2 className={`text-xl font-bold mb-4 pb-2 border-b 
                   ${isDanger ? 'text-red-600 border-red-200 flex items-center gap-2' : 'text-gray-900'}`}
    >
      {isDanger && <AlertTriangle size={20} />}
      {title}
    </h2>
    {children}
  </motion.div>
);
// ------------------------------------

// --- "Component" (Component) "chính" (main) ---
const SettingsDangerZone = () => {
  // "Bộ não" (Brain) "quản lý" (manage) "việc" (task) "Mở/Đóng" (Open/Close) "Modal" (Modal) "Xác nhận" (Confirm)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "HR" (HR) "bấm" (click) "nút" (button) "XÓA" (DELETE) "THẬT" (FOR REAL)
  const handleDeleteAccount = () => {
    console.log('ĐANG XÓA TÀI KHOẢN... (Sau "này" (later) "gọi" (call) "API" (API) "ở" (at) "đây" (here))');
    // (Gọi (Call) API "xóa" (delete) "tài khoản" (account) "ở" (at) "đây" (here))
    setIsModalOpen(false); // "Đóng" (Close) "modal" (modal) "lại" (again)
  };

  // "Animation" (Animation) "cho" (for) "Modal" (Modal)
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <>
      <div className="space-y-6">
        
        {/* CARD 1: VÙNG NGUY HIỂM */}
        <SectionCard title="Vùng Nguy Hiểm" isDanger={true}>
          <div className="space-y-4">
            
            {/* "Mục" (Item) "Xóa" (Delete) "Tài khoản" (Account) */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between rounded-lg border border-red-200 p-4">
              <div>
                <h4 className="font-semibold text-gray-900">Xóa Tài khoản Công ty</h4>
                <p className="text-sm text-gray-600">
                  Hành động này sẽ xóa vĩnh viễn tài khoản của bạn, bao gồm tất cả Jobs, Ứng viên, và Tin nhắn.
                  <br/>
                  <span className="font-semibold">Hành động này không thể hoàn tác.</span>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)} // <-- "MỞ" (OPEN) "MODAL" (MODAL) "XÁC NHẬN" (CONFIRM)
                className="mt-3 md:mt-0 md:ml-4 flex-shrink-0 flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 
                           font-semibold text-white shadow-lg transition-all 
                           hover:scale-105 hover:bg-red-700"
              >
                <Trash2 size={18} />
                Xóa Tài khoản...
              </button>
            </div>
            
            {/* (Sau "này" (later) "bạn" (you) "có thể" (can) "thêm" (add) "các" (other) "hành động" (actions) "nguy hiểm" (dangerous) "khác" (other) "ở" (at) "đây" (here)) */}

          </div>
        </SectionCard>

      </div>

      {/* --- MODAL "XÁC NHẬN" (CONFIRMATION) "XỊN" (PRO) (Full "Logic") --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            // "Lớp" (Layer) "nền" (background) "mờ" (dim)
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)} // "Click" (Click) "ra" (outside) "ngoài" (of) "là" (is) "Hủy" (Cancel)
          >
            <motion.div
              variants={modalVariants}
              className="relative w-full max-w-lg rounded-xl bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()} // "Ngăn" (Stop) "click" (click) "xuyên" (through) "thủng" (modal)
            >
              {/* Header "Modal" (Modal) */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                  <AlertTriangle />
                  Xác nhận Xóa Tài khoản?
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-1.5 text-gray-400 hover:bg-gray-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* "Nội dung" (Body) "Modal" (Modal) */}
              <div className="p-6">
                <p className="text-gray-700">
                  Bạn có <span className="font-bold">thực sự chắc chắn</span> muốn xóa tài khoản này không?
                  <br/><br/>
                  Toàn bộ dữ liệu (Jobs, Ứng viên, Tin nhắn, Gói VIP...) sẽ bị <span className="font-bold text-red-600">XÓA VĨNH VIỄN</span>.
                  Hành động này không thể hoàn tác.
                </p>
              </div>

              {/* "Nút" (Buttons) "Hủy" (Cancel) "và" (and) "Xóa" (Delete) */}
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
                  onClick={handleDeleteAccount} // <-- "HÀNH ĐỘNG" (ACTION) "HỦY DIỆT" (DESTRUCTIVE)
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700"
                >
                  <Trash2 size={16} />
                  Tôi hiểu, Xóa Tài khoản
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

export default SettingsDangerZone;