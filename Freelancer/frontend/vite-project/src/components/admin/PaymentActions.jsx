import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreHorizontal, Eye, RefreshCw, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Đây là "Dropdown" (Dropdown) "3 chấm" (3-dot) "VÀ" (AND) "Modal" (Modal) "Hoàn Tiền" (Refund)
 * @param {object} props
 * @param {object} props.transaction - "Data" (Data) "của" (of) "giao dịch" (transaction) "đang" (being) "chọn" (selected)
 */
const PaymentActions = ({ transaction }) => {
  // "State" (State) "cho" (for) "Dropdown" (Dropdown) "3 chấm" (3-dot)
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  // "State" (State) "cho" (for) "Modal" (Modal) "Hoàn Tiền" (Refund)
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // "State" (State) "cho" (for) "cái" (the) "form" (form) "Modal" (Modal)
  const [refundReason, setRefundReason] = useState('');

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

  // "Hàm" (Function) "xử lý" (handle) "khi" (when) "Admin" (Admin) "bấm" (click) "nút" (button) "XÁC NHẬN HOÀN TIỀN" (CONFIRM REFUND)
  const handleRefundSubmit = () => {
    if (!refundReason) {
      alert('Vui lòng nhập lý do hoàn tiền!'); // "Sẽ" (Will) "thay" (replace) "bằng" (with) "toast" (toast) "sau" (later)
      return;
    }
    console.log(`
      ĐÃ HOÀN TIỀN: ${transaction.id}
      User: ${transaction.user}
      Số tiền: ${transaction.amount}
      Lý do: ${refundReason}
    `);
    // (Sau "này" (later) "gọi" (call) "API" (API) "hoàn tiền" (refund) "ở" (at) "đây" (here))
    setIsModalOpen(false); // "Đóng" (Close) "modal" (modal)
    setIsActionsOpen(false); // "Đóng" (Close) "dropdown" (dropdown)
    setRefundReason(''); // "Reset" (Reset) "form" (form)
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
              {/* "Nút" (Button) "Xem Chi tiết" (View Details) (Tạm "thời" (temporarily) "chưa" (not) "làm" (do) "gì" (anything)) */}
              <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Eye size={16} /> Xem Chi tiết Giao dịch
              </button>
              
              {/* "NÚT" (BUTTON) "HOÀN TIỀN" (REFUND) (MÀU "ĐỎ" (RED)) */}
              {/* "Chỉ" (Only) "hiện" (show) "nút" (button) "này" (this) "khi" (when) "giao dịch" (transaction) "đang" (is) "Thành công" (Successful) */}
              {transaction.status === 'Thành công' && (
                <button 
                  onClick={() => setIsModalOpen(true)} // <-- "MỞ" (OPEN) "MODAL" (MODAL) "XÁC NHẬN" (CONFIRM)
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <RefreshCw size={16} /> Hoàn tiền...
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* 2. "MODAL" (MODAL) "XÁC NHẬN" (CONFIRMATION) "HOÀN TIỀN" (REFUND) (Full "Logic") */}
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
                  Xác nhận Hoàn tiền Giao dịch?
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
                  Bạn sắp hoàn <span className="font-bold text-red-600">{transaction.amount} VNĐ</span>
                  cho tài khoản <span className="font-bold">{transaction.user}</span>
                  (Gói: {transaction.package}).
                </p>
                
                {/* 1. "Form" (Form) "Nhập" (Input) "Lý do" (Reason) */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-1">
                    Lý do Hoàn tiền (Bắt buộc): *
                  </label>
                  <textarea
                    id="reason"
                    rows={4}
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="VD: Khách hàng khiếu nại, thanh toán nhầm..."
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* "Nút" (Buttons) "Hủy" (Cancel) "và" (and) "Xác nhận" (Confirm) "Hoàn Tiền" (Refund) */}
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
                  onClick={handleRefundSubmit} // <-- "HÀNH ĐỘNG" (ACTION) "HOÀN TIỀN" (REFUND)
                  className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm 
                             font-semibold text-white shadow-lg hover:bg-red-700
                             disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!refundReason} // "Không" (Don't) "cho" (let) "bấm" (click) "nếu" (if) "chưa" (not yet) "nhập" (input) "lý do" (reason)
                >
                  <RefreshCw size={16} />
                  Xác nhận Hoàn tiền
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

export default PaymentActions;