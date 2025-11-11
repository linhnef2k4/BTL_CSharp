import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Eye, Star, Key, ShieldOff, Trash2, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Đây là "Dropdown" (Dropdown) "3 chấm" (3-dot) "VÀ" (AND) "Modal" (Modal) "Ban" (Ban)
 * @param {object} props
 * @param {object} props.user - "Data" (Data) "của" (of) "user" (user) "đang" (being) "chọn" (selected)
 */
const UserActions = ({ user }) => {
  // "State" (State) "cho" (for) "Dropdown" (Dropdown) "3 chấm" (3-dot)
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  // "State" (State) "cho" (for) "Modal" (Modal) "Ban" (Ban)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // "State" (State) "cho" (for) "cái" (the) "form" (form) "Modal" (Modal) "Ban" (Ban)
  const [banDuration, setBanDuration] = useState('1-week');
  const [banReason, setBanReason] = useState('');

  // "Animation" (Animation) "cho" (for) "Dropdown" (Dropdown)
  const dropdownVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };
  
  // "Animation" (Animation) "cho" (for) "Modal" (Modal)
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 50 },
    visible: { opacity: 1, scale: 1, y: 0 },
  };

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "Admin" (Admin) "bấm" (click) "nút" (button) "XÁC NHẬN KHÓA" (CONFIRM BAN)
  const handleBanUser = () => {
    if (!banReason) {
      alert('Vui lòng nhập lý do khóa tài khoản!'); // "Chúng ta" (We) "sẽ" (will) "thay" (replace) "cái" (this) "này" (this) "bằng" (with) "toast" (toast) "sau" (later)
      return;
    }
    console.log(`
      ĐÃ KHÓA TÀI KHOẢN: ${user.name} (ID: ${user.id})
      Thời hạn: ${banDuration}
      Lý do: ${banReason}
    `);
    // (Sau "này" (later) "gọi" (call) "API" (API) "ban" (ban) "user" (user) "ở" (at) "đây" (here))
    setIsModalOpen(false); // "Đóng" (Close) "modal" (modal)
    setIsActionsOpen(false); // "Đóng" (Close) "dropdown" (dropdown)
    setBanReason(''); // "Reset" (Reset) "form" (form)
  };

  return (
    <>
      {/* 1. "NÚT" (BUTTON) "3 CHẤM" (3-DOT) */}
      <div className="relative">
        <button
          onClick={() => setIsActionsOpen(prev => !prev)}
          className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
        >
          <MoreHorizontal size={20} />
        </button>

        {/* "MENU" (MENU) "XỔ XUỐNG" (DROPDOWN) */}
        <AnimatePresence>
          {isActionsOpen && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-0 z-10 mt-1 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
              onMouseLeave={() => setIsActionsOpen(false)} // "Tự" (Auto) "đóng" (close) "khi" (when) "di" (mouse) "chuột" (leaves) "ra" (out)
            >
              {/* "Nút" (Button) "Xem Hồ sơ" (View Profile) */}
              <Link 
                to={`/profile/${user.id}`} // (Sau "này" (later) "cần" (need) "sửa" (fix) "link" (link) "này" (this) "cho" (for) "chuẩn" (standard))
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Eye size={16} /> Xem Hồ sơ
              </Link>
              
              {/* "Nút" (Button) "Cấp VIP" (Grant VIP) */}
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-yellow-600 hover:bg-gray-100">
                <Star size={16} /> Cấp VIP (Thủ công)
              </button>
              
              {/* "Nút" (Button) "Đặt lại MK" (Reset Pass) */}
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-gray-100">
                <Key size={16} /> Đặt lại Mật khẩu
              </button>
              
              <hr className="my-1"/>
              
              {/* "NÚT" (BUTTON) "KHÓA" (BAN) (MÀU "ĐỎ" (RED)) */}
              <button 
                onClick={() => setIsModalOpen(true)} // <-- "MỞ" (OPEN) "MODAL" (MODAL) "XÁC NHẬN" (CONFIRM)
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <ShieldOff size={16} /> Khóa Tài khoản...
              </button>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 2. "MODAL" (MODAL) "XÁC NHẬN" (CONFIRMATION) "KHÓA" (BAN) (Full "Logic") */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setIsModalOpen(false)} // "Click" (Click) "ra" (outside) "ngoài" (of) "là" (is) "Hủy" (Cancel)
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
                  Xác nhận Khóa Tài khoản?
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
                  Bạn sắp khóa tài khoản: <span className="font-bold">{user.name}</span>
                </p>
                
                {/* 1. "Form" (Form) "Chọn" (Select) "Thời hạn" (Duration) */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-semibold text-gray-700 mb-1">
                    Thời hạn Khóa: *
                  </label>
                  <select
                    id="duration"
                    value={banDuration}
                    onChange={(e) => setBanDuration(e.target.value)}
                    className="w-full rounded-lg border-gray-300 py-2.5 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="1-week">1 Tuần</option>
                    <option value="1-month">1 Tháng</option>
                    <option value="permanent">Vĩnh viễn</option>
                  </select>
                </div>

                {/* 2. "Form" (Form) "Nhập" (Input) "Lý do" (Reason) */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
                    Lý do Khóa (Bắt buộc): *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={banReason}
                    onChange={(e) => setBanReason(e.target.value)}
                    placeholder="VD: Vi phạm điều khoản, spam nội dung..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* "Nút" (Buttons) "Hủy" (Cancel) "và" (and) "Xác nhận" (Confirm) "Khóa" (Ban) */}
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
                  onClick={handleBanUser} // <-- "HÀNH ĐỘNG" (ACTION) "HỦY DIỆT" (DESTRUCTIVE)
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700
                             disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!banReason} // "Không" (Don't) "cho" (let) "bấm" (click) "nếu" (if) "chưa" (not yet) "nhập" (input) "lý do" (reason)
                >
                  <ShieldOff size={16} />
                  Xác nhận Khóa
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

export default UserActions;